import { mkdtempSync, readFileSync, rmSync, existsSync, readdirSync } from 'node:fs';
import { tmpdir, homedir } from 'node:os';
import { join } from 'node:path';

type Offender = { tag: string; cls: string; left: number; right: number };
type Report = { width: number; scrollWidth: number; offenders: Offender[]; sidebar: string };

const TIMEOUT_MS = 90_000;

/** Finds a Chrome or Chromium binary: $CHROME, then the PATH, then the Playwright cache. */
function findChrome(): string | null {
    if (process.env.CHROME) return process.env.CHROME;
    for (const name of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser']) {
        const found = Bun.which(name);
        if (found) return found;
    }
    const cache = join(homedir(), '.cache', 'ms-playwright');
    if (!existsSync(cache)) return null;
    for (const dir of readdirSync(cache).filter((d) => d.startsWith('chromium-')).sort().reverse()) {
        for (const sub of ['chrome-linux64', 'chrome-linux']) {
            const bin = join(cache, dir, sub, 'chrome');
            if (existsSync(bin)) return bin;
        }
    }
    return null;
}

/** Waits for Chrome to write the DevTools port into its profile and returns the browser socket URL. */
async function devtoolsUrl(profile: string, deadline: number): Promise<string> {
    const file = join(profile, 'DevToolsActivePort');
    while (Date.now() < deadline) {
        if (existsSync(file)) {
            const [port, path] = readFileSync(file, 'utf8').trim().split('\n');
            if (port && path) return `ws://127.0.0.1:${port}${path}`;
        }
        await Bun.sleep(100);
    }
    throw new Error('Chrome never opened its DevTools port');
}

/** A minimal CDP client: send a command, await its result. */
function connect(url: string): Promise<(method: string, params?: object, sessionId?: string) => Promise<any>> {
    return new Promise((resolve, reject) => {
        const socket = new WebSocket(url);
        const pending = new Map<number, (message: any) => void>();
        let next = 1;
        socket.onmessage = (event) => {
            const message = JSON.parse(String(event.data));
            pending.get(message.id)?.(message);
            pending.delete(message.id);
        };
        socket.onerror = () => reject(new Error('DevTools socket failed'));
        socket.onopen = () =>
            resolve((method, params = {}, sessionId) => {
                const id = next++;
                socket.send(JSON.stringify({ id, method, params, sessionId }));
                return new Promise((done, fail) =>
                    pending.set(id, (message) => (message.error ? fail(new Error(message.error.message)) : done(message.result)))
                );
            });
    });
}

/** Loads the probe page and returns its verdict and per-width reports. */
async function probe(url: string): Promise<{ verdict: string; reports: Record<string, Report> }> {
    const chrome = findChrome();
    if (!chrome) throw new Error('no Chrome or Chromium found; set CHROME=/path/to/chrome');
    const profile = mkdtempSync(join(tmpdir(), 'muse-overflow-'));
    const browser = Bun.spawn(
        [chrome, '--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--window-size=1600,1000', 'about:blank'],
        { stdout: 'ignore', stderr: 'ignore' }
    );
    const deadline = Date.now() + TIMEOUT_MS;
    try {
        const send = await connect(await devtoolsUrl(profile, deadline));
        const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
        const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
        await send('Page.navigate', { url }, sessionId);
        while (Date.now() < deadline) {
            const { result } = await send(
                'Runtime.evaluate',
                {
                    expression: `(() => { const o = document.getElementById('overflow-report'); return o ? JSON.stringify({ verdict: o.dataset.overflow, text: o.textContent }) : null; })()`,
                    returnByValue: true
                },
                sessionId
            );
            const state = result?.value ? JSON.parse(result.value) : null;
            if (state && state.verdict !== 'pending') return { verdict: state.verdict, reports: JSON.parse(state.text) };
            await Bun.sleep(250);
        }
        throw new Error(`the page never reported within ${TIMEOUT_MS / 1000}s`);
    } finally {
        browser.kill();
        await browser.exited;
        rmSync(profile, { recursive: true, force: true });
    }
}

const url = process.argv[2];
if (!url) {
    console.error('usage: bun scripts/overflow-probe.ts http://127.0.0.1:5188/overflow');
    process.exit(2);
}

try {
    const { verdict, reports } = await probe(url);
    for (const [width, r] of Object.entries(reports).sort(([a], [b]) => Number(a) - Number(b))) {
        console.log(`  ${width}px: document ${r.scrollWidth}px wide, ${r.offenders.length} overflowing element(s), sidebar ${r.sidebar}`);
        for (const o of r.offenders) console.log(`      <${o.tag} class="${o.cls}"> spans ${o.left}..${o.right}px`);
    }
    process.exit(verdict === 'pass' ? 0 : 1);
} catch (error) {
    console.error(`overflow probe: ${(error as Error).message}`);
    process.exit(1);
}

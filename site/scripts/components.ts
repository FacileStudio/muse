/*
 * The component index is read out of the library at build time, never hand-listed.
 *
 * muse's own README shipped three different component counts at once (48, 51, 58) precisely
 * because they were typed by hand in three places. The barrel is the only thing that knows
 * what is exported, and the `<script module>` interfaces are the only thing that knows what a
 * component takes — so both are parsed rather than transcribed.
 */
import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const LIB = join(HERE, '../../src/lib');

export type PropDoc = { name: string; type: string; optional: boolean; doc: string };
export type ComponentDoc = {
    name: string;
    tier: string;
    file: string;
    extends: string[];
    props: PropDoc[];
    lead?: string;
};

const TIERS: Record<string, string> = {
    layout: 'Mise en page',
    atoms: 'Atomes',
    molecules: 'Molécules',
    organisms: 'Organismes',
    charts: 'Graphiques',
    motion: 'Motion'
};

function exported(): { name: string; path: string }[] {
    const barrel = readFileSync(join(LIB, 'index.ts'), 'utf8');
    const out: { name: string; path: string }[] = [];
    for (const line of barrel.split('\n')) {
        const m = /^export \{ default as (\w+) \} from '\.\/(components\/[^']+)';/.exec(line);
        if (m) out.push({ name: m[1], path: m[2] });
    }
    return out;
}

/* Balanced-brace scan: a prop whose type is an object literal contains semicolons and
   newlines, so splitting the interface body on either loses half of it. */
function interfaceBody(source: string, name: string): { body: string; ext: string[] } | null {
    const suffixed = new RegExp(`export (?:interface|type) ${name}Props([^;{]*)\\{`).exec(source);
    const bare = new RegExp(`export (?:interface|type) ${name}\\s*=?\\s*\\{`).exec(source);
    const decl = suffixed ?? bare;
    if (!decl) return null;
    /* The bare-name branch has no capture group; a local alias declares no extends. */
    const head = decl[1] ?? '';
    const ext = (head.match(/extends ([^{]+)/)?.[1] ?? head.replace('=', ''))
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s && s !== '=');

    let depth = 0;
    let i = decl.index + decl[0].length - 1;
    const start = i + 1;
    for (; i < source.length; i++) {
        if (source[i] === '{') depth++;
        else if (source[i] === '}') {
            depth--;
            if (depth === 0) break;
        }
    }
    return { body: source.slice(start, i), ext };
}

function parseProps(body: string): PropDoc[] {
    const props: PropDoc[] = [];

    /*
     * Split on `;` at depth zero, not on newlines. A component that declares two props on one
     * line — `class?: string; value?: string`, which is how the props codemod left several —
     * would otherwise parse as a single prop whose type is the rest of the line. And a prop
     * whose type is an object or a function signature spans lines and contains its own
     * semicolons, so neither split works on its own.
     */
    const parts: string[] = [];
    let depth = 0;
    let buf = '';
    for (const ch of body) {
        if ('{(<['.includes(ch)) depth++;
        if ('})>]'.includes(ch)) depth--;
        if (ch === ';' && depth === 0) {
            parts.push(buf);
            buf = '';
        } else {
            buf += ch;
        }
    }
    parts.push(buf);

    for (const part of parts) {
        /* The JSDoc that precedes a prop, if it has one. */
        const doc = /\/\*\*([\s\S]*?)\*\//.exec(part)?.[1];
        const code = part.replace(/\/\*[\s\S]*?\*\//g, '').trim();
        if (!code) continue;

        const m = /^'?([\w-]+)'?(\?)?:\s*([\s\S]+)$/.exec(code);
        if (!m) continue;
        props.push({
            name: m[1],
            optional: Boolean(m[2]),
            type: m[3].replace(/\s+/g, ' ').trim(),
            doc: (doc ?? '')
                .split('\n')
                .map((l) => l.replace(/^\s*\*?\s?/, '').trim())
                .join(' ')
                .replace(/\s+/g, ' ')
                .trim()
        });
    }
    return props;
}

/* The first sentence of the component's own leading block comment. These comments are the
   most reliable prose in the repo — they were written to explain a decision to the next
   reader, which is exactly what a docs blurb is. */
function lead(source: string): string | undefined {
    const m = /<script lang="ts">[\s\S]*?\/\*\s*\n?([\s\S]*?)\*\//.exec(source);
    if (!m) return undefined;
    const text = m[1]
        .split('\n')
        .map((l) => l.replace(/^\s*\*?\s?/, '').trim())
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
    const first = text.split(/(?<=\.)\s/)[0];
    return first && first.length > 25 && first.length < 320 ? first : undefined;
}

export function collect(): ComponentDoc[] {
    return exported()
        .map(({ name, path }) => {
            const file = join(LIB, `${path}`);
            const source = readFileSync(file, 'utf8');
            /*
             * `export type XProps = A & B;` has no body of its own — an interface cannot extend
             * a union, so `NavButton`'s props live in a local `Own` alias. Match the alias form
             * first: scanning for the next `{` walks straight past it into the instance script
             * and returns whatever object literal it finds there.
             */
            const alias = new RegExp(`export type ${name}Props\\s*=\\s*([^;]+);`).exec(source);
            let parsed = alias ? null : interfaceBody(source, name);

            if (alias) {
                const parts = alias[1].split('&').map((x) => x.trim().replace(/^\(|\)$/g, ''));
                const ext: string[] = [];
                let body = '';
                for (const part of parts) {
                    if (part.startsWith('{')) {
                        body += part.slice(1, -1);
                        continue;
                    }
                    const local = /^\w+$/.test(part) ? interfaceBody(source, part) : null;
                    if (local?.body.trim()) body += local.body;
                    else ext.push(part);
                }
                parsed = { body, ext };
            }

            return {
                name,
                tier: TIERS[path.split('/')[1]] ?? path.split('/')[1],
                file: path,
                extends: parsed?.ext ?? [],
                props: parsed ? parseProps(parsed.body) : [],
                lead: lead(source)
            };
        })
        .sort((a, b) => a.name.localeCompare(b.name, 'fr'));
}

if (import.meta.main) {
    const docs = collect();
    mkdirSync(join(HERE, '../src/lib/generated'), { recursive: true });
    writeFileSync(
        join(HERE, '../src/lib/generated/components.json'),
        JSON.stringify(docs, null, 2) + '\n'
    );
    const withProps = docs.filter((d) => d.props.length > 0).length;
    console.log(`${docs.length} components, ${withProps} with parsed props`);
    if (docs.length < 45) throw new Error(`only ${docs.length} components found — the barrel parse broke`);
    if (withProps / docs.length < 0.8) {
        throw new Error(`only ${withProps}/${docs.length} yielded props — the interface parse broke`);
    }
}

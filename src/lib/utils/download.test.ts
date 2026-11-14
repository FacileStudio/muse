import { describe, expect, test } from 'bun:test';
import { commandParts, detectPlatform, entryDetail, formatSize, groupDownloads, uniqueCommands, type DownloadEntry } from './download.js';

const UA = {
    mac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/17.0 Safari/605.1.15',
    windows: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36',
    linux: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36',
    android: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/120.0 Mobile Safari/537.36',
    iphone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148',
    chromeos: 'Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 Chrome/120.0 Safari/537.36'
};

describe('detectPlatform', () => {
    test('reads each platform from its user agent', () => {
        expect(detectPlatform(UA.mac)).toBe('macos');
        expect(detectPlatform(UA.windows)).toBe('windows');
        expect(detectPlatform(UA.linux)).toBe('linux');
        expect(detectPlatform(UA.iphone)).toBe('ios');
    });

    test('Android wins over the Linux token it also carries', () => {
        expect(detectPlatform(UA.android)).toBe('android');
    });

    test('an iPad posing as a Mac is iOS once it reports touch points', () => {
        expect(detectPlatform(UA.mac, 5)).toBe('ios');
        expect(detectPlatform(UA.mac, 0)).toBe('macos');
    });

    test('ChromeOS and unknown agents recommend nothing', () => {
        expect(detectPlatform(UA.chromeos)).toBeNull();
        expect(detectPlatform('')).toBeNull();
    });
});

describe('groupDownloads', () => {
    const entries: DownloadEntry[] = [
        { platform: 'android', href: 'https://x.test/app.apk' },
        { platform: 'linux', href: 'https://x.test/app.deb', label: '.deb' },
        { platform: 'macos', href: 'https://x.test/app.dmg', checksumHref: 'javascript:alert(1)' },
        { platform: 'linux', href: 'https://x.test/app.rpm', label: '.rpm' },
        { platform: 'linux', href: 'https://x.test/app.deb', label: 'duplicate' },
        { platform: 'windows', href: 'javascript:alert(1)' },
        { platform: 'beos' as DownloadEntry['platform'], href: 'https://x.test/app.pkg' }
    ];

    test('groups in canonical order and keeps file order inside a platform', () => {
        const groups = groupDownloads(entries);
        expect(groups.map((g) => g.platform)).toEqual(['macos', 'linux', 'android']);
        expect(groups[1].entries.map((e) => e.label)).toEqual(['.deb', '.rpm']);
    });

    test('drops unsafe hrefs, unknown platforms, duplicates and unsafe checksum links', () => {
        const all = groupDownloads(entries).flatMap((g) => g.entries);
        expect(all).toHaveLength(4);
        expect(all.find((e) => e.platform === 'macos')?.checksumHref).toBeUndefined();
    });

    test('moves the featured platform first', () => {
        expect(groupDownloads(entries, 'android').map((g) => g.platform)).toEqual(['android', 'macos', 'linux']);
        expect(groupDownloads(entries, 'ios').map((g) => g.platform)).toEqual(['macos', 'linux', 'android']);
    });
});

describe('uniqueCommands', () => {
    test('drops blank and repeated commands, keeping the first label', () => {
        const out = uniqueCommands([
            { label: 'Script', command: 'curl -fsSL https://x.test/install.sh | sh' },
            { label: 'Again', command: ' curl -fsSL https://x.test/install.sh | sh ' },
            { label: 'Empty', command: '  ' },
            { label: 'Homebrew', command: 'brew install facilestudio/tap/x' }
        ]);
        expect(out.map((c) => c.label)).toEqual(['Script', 'Homebrew']);
    });
});

describe('formatSize and entryDetail', () => {
    test('formats bytes per locale and passes strings through', () => {
        expect(formatSize(84_200_000, 'en')).toBe('84 MB');
        expect(formatSize(4_250_000, 'en')).toBe('4.3 MB');
        expect(formatSize('12 MB', 'fr')).toBe('12 MB');
        expect(formatSize(0, 'en')).toBe('');
        expect(formatSize(Number.NaN, 'en')).toBe('');
    });

    test('joins arch, version and size, skipping what is missing', () => {
        expect(entryDetail({ platform: 'macos', href: '/x', arch: 'arm64', version: 'v1.2.0', size: 4_250_000 }, 'en')).toBe(
            'arm64 · v1.2.0 · 4.3 MB'
        );
        expect(entryDetail({ platform: 'macos', href: '/x' }, 'en')).toBe('');
    });
});

describe('commandParts', () => {
    test('cuts words at spaces, then after each slash and before a long dotted name, and keeps every character', () => {
        const command = 'curl -fsSL https://x.dev/a/install.sh | bash';
        expect(commandParts('brew install FacileStudio/tap/sablier')).toEqual([
            ['brew'],
            ['install'],
            ['FacileStudio/', 'tap/', 'sablier']
        ]);
        expect(commandParts('https://raw.example.com/install.sh')).toEqual([['https://', 'raw.', 'example.com/', 'install.sh']]);
        expect(commandParts(command).map((word) => word.join('')).join(' ')).toBe(command);
        expect(commandParts('  nuage  mcp ')).toEqual([['nuage'], ['mcp']]);
    });
});

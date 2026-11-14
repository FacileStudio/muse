import { describe, expect, test } from 'bun:test';
import { groupDownloads, isMobilePlatform, selectForDevice, type DownloadEntry, type Platform } from './download.js';

const entries: DownloadEntry[] = [
    { platform: 'macos', href: 'https://x.test/app-arm64.dmg', label: 'Apple Silicon' },
    { platform: 'macos', href: 'https://x.test/app-x64.dmg', label: 'Intel' },
    { platform: 'windows', href: 'https://x.test/app.exe' },
    { platform: 'linux', href: 'https://x.test/app.deb', label: '.deb' },
    { platform: 'linux', href: 'https://x.test/app.AppImage', label: '.AppImage' },
    { platform: 'ios', href: 'https://apps.apple.com/app/id1' },
    { platform: 'android', href: 'https://x.test/app.apk', label: 'APK' },
    { platform: 'android', href: 'https://play.google.com/store/apps/details?id=x', label: 'Play Store' }
];
const groups = groupDownloads(entries);
const desktopOnly = groupDownloads(entries.filter((e) => !isMobilePlatform(e.platform)));
const mobileOnly = groupDownloads(entries.filter((e) => isMobilePlatform(e.platform)));

function pick(platform: Platform | null, opts: { from?: typeof groups; cli?: boolean; all?: boolean } = {}) {
    const out = selectForDevice(opts.from ?? groups, opts.cli ?? true, platform, opts.all ?? true);
    const count = out.groups.flatMap((g) => g.entries).length;
    return { platforms: out.groups.map((g) => g.platform), count, cli: out.cli };
}

describe('selectForDevice', () => {
    test('a desktop visitor gets every variant of their OS and the CLI', () => {
        expect(pick('macos')).toEqual({ platforms: ['macos'], count: 2, cli: true });
        expect(pick('windows')).toEqual({ platforms: ['windows'], count: 1, cli: true });
        expect(pick('linux')).toEqual({ platforms: ['linux'], count: 2, cli: true });
    });

    test('a phone visitor gets every variant of their platform and no CLI', () => {
        expect(pick('android')).toEqual({ platforms: ['android'], count: 2, cli: false });
        expect(pick('ios')).toEqual({ platforms: ['ios'], count: 1, cli: false });
    });

    test('a desktop visitor without an entry for their OS still gets the CLI', () => {
        expect(pick('linux', { from: mobileOnly })).toEqual({ platforms: [], count: 0, cli: true });
        expect(pick('macos', { from: [] })).toEqual({ platforms: [], count: 0, cli: true });
    });

    test('a visitor with nothing relevant gets the link alone', () => {
        expect(pick('android', { from: desktopOnly })).toEqual({ platforms: [], count: 0, cli: false });
        expect(pick('windows', { from: mobileOnly, cli: false })).toEqual({ platforms: [], count: 0, cli: false });
        expect(pick('ios', { from: [], cli: true })).toEqual({ platforms: [], count: 0, cli: false });
    });

    test('an unknown platform gets the link alone', () => {
        expect(pick(null)).toEqual({ platforms: [], count: 0, cli: false });
    });

    test('without allHref, nothing relevant falls back to everything', () => {
        expect(pick(null, { all: false })).toEqual({
            platforms: ['macos', 'windows', 'linux', 'ios', 'android'],
            count: 8,
            cli: true
        });
        expect(pick('android', { from: desktopOnly, all: false })).toEqual({
            platforms: ['macos', 'windows', 'linux'],
            count: 5,
            cli: true
        });
    });

    test('without allHref, a relevant match still narrows', () => {
        expect(pick('macos', { all: false })).toEqual({ platforms: ['macos'], count: 2, cli: true });
    });
});

describe('isMobilePlatform', () => {
    test('only iOS and Android are mobile', () => {
        expect(['ios', 'android'].every((p) => isMobilePlatform(p as Platform))).toBe(true);
        expect(['macos', 'windows', 'linux'].some((p) => isMobilePlatform(p as Platform))).toBe(false);
        expect(isMobilePlatform(null)).toBe(false);
    });
});

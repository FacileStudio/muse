import { isSafeHref } from './href.js';

export type Platform = 'macos' | 'windows' | 'linux' | 'android' | 'ios';

/** One downloadable file. A platform can have several: `.dmg` per arch, `.deb` and `.rpm`, an APK and the store. */
export interface DownloadEntry {
    platform: Platform;
    /** Same-origin path or `https://` URL. An unsafe value is dropped. */
    href: string;
    /** What this file is, such as `Apple Silicon`, `.deb` or `App Store`. Defaults to the platform name. */
    label?: string;
    /** CPU architecture, such as `arm64`, `x64` or `universal`. */
    arch?: string;
    version?: string;
    /** Bytes as a number, formatted for the locale, or a ready string such as `84 MB`. */
    size?: number | string;
    /** Link to this file's checksum. An unsafe value is dropped. */
    checksumHref?: string;
}

/** One copyable install command, such as `brew install facilestudio/tap/x`. */
export interface CliCommand {
    label: string;
    command: string;
}

export interface DownloadGroup {
    platform: Platform;
    entries: DownloadEntry[];
}

/** Canonical display order: desktop first, then mobile. */
export const PLATFORM_ORDER: readonly Platform[] = ['macos', 'windows', 'linux', 'ios', 'android'];

/**
 * The visitor's platform from a user agent, or null when it is not one muse offers.
 * iPadOS reports a Mac user agent, so a "Mac" with more than one touch point is read as iOS.
 */
export function detectPlatform(userAgent: string, maxTouchPoints = 0): Platform | null {
    if (/android/i.test(userAgent)) return 'android';
    if (/iphone|ipad|ipod/i.test(userAgent)) return 'ios';
    if (/mac os x|macintosh/i.test(userAgent)) return maxTouchPoints > 1 ? 'ios' : 'macos';
    if (/windows/i.test(userAgent)) return 'windows';
    if (/cros/i.test(userAgent)) return null;
    if (/linux|x11/i.test(userAgent)) return 'linux';
    return null;
}

/**
 * Entries grouped by platform in canonical order, with the `featured` platform moved first.
 * Unknown platforms, unsafe hrefs and repeated hrefs are dropped; an unsafe checksum link is removed.
 */
export function groupDownloads(entries: readonly DownloadEntry[], featured: Platform | null = null): DownloadGroup[] {
    const seen = new Set<string>();
    const byPlatform = new Map<Platform, DownloadEntry[]>();
    for (const entry of entries) {
        if (!PLATFORM_ORDER.includes(entry.platform) || !isSafeHref(entry.href) || seen.has(entry.href)) continue;
        seen.add(entry.href);
        const clean = isSafeHref(entry.checksumHref) ? entry : { ...entry, checksumHref: undefined };
        byPlatform.set(entry.platform, [...(byPlatform.get(entry.platform) ?? []), clean]);
    }
    const order = featured ? [featured, ...PLATFORM_ORDER.filter((p) => p !== featured)] : PLATFORM_ORDER;
    return order.flatMap((platform) => {
        const list = byPlatform.get(platform);
        return list ? [{ platform, entries: list }] : [];
    });
}

/** Commands with an empty or repeated command string removed, first label kept. */
export function uniqueCommands(commands: readonly CliCommand[]): CliCommand[] {
    const seen = new Set<string>();
    return commands.filter((c) => {
        const key = c.command.trim();
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

/** A byte count as megabytes in the locale (`84.2 MB`, `84,2 Mo`); a string passes through. */
export function formatSize(size: number | string | undefined, locale: string): string {
    if (typeof size === 'string') return size;
    if (typeof size !== 'number' || !Number.isFinite(size) || size <= 0) return '';
    const megabytes = size / 1_000_000;
    return new Intl.NumberFormat(locale, {
        style: 'unit',
        unit: 'megabyte',
        maximumFractionDigits: megabytes < 10 ? 1 : 0
    }).format(megabytes);
}

/** The muted detail line for one entry: arch, version and size, joined by a middle dot. */
export function entryDetail(entry: DownloadEntry, locale: string): string {
    return [entry.arch, entry.version, formatSize(entry.size, locale)].filter(Boolean).join(' · ');
}

/** `all` lists every platform; `device` shows only what fits the visitor's device. */
export type DownloadMode = 'all' | 'device';

/** What a `device` mode section renders. `groups` empty and `cli` false means the "All downloads" link alone. */
export interface DeviceSelection {
    groups: DownloadGroup[];
    cli: boolean;
}

const MOBILE: readonly Platform[] = ['ios', 'android'];

/** True for a phone or tablet platform, where a CLI is no use. */
export function isMobilePlatform(platform: Platform | null): boolean {
    return platform !== null && MOBILE.includes(platform);
}

/**
 * The cards and CLI to show a visitor on `platform`. A phone gets its own entries and no CLI, a desktop its own entries
 * and the CLI. When nothing fits, or the platform is unknown, nothing is selected; without an `allHref` to fall back
 * on, everything is.
 */
export function selectForDevice(
    groups: readonly DownloadGroup[],
    hasCli: boolean,
    platform: Platform | null,
    hasAllHref: boolean
): DeviceSelection {
    const own = platform === null ? [] : groups.filter((g) => g.platform === platform);
    const cli = platform !== null && !isMobilePlatform(platform) && hasCli;
    if (own.length || cli) return { groups: own, cli };
    return hasAllHref ? { groups: [], cli: false } : { groups: [...groups], cli: hasCli };
}

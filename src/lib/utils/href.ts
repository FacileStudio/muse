const UNSAFE = /[\s\\\p{Cc}]/u;

/**
 * True for a same-origin path (`/x`, not `//host`) or an absolute `https://` URL with a host
 * and no credentials. Rejects `javascript:`, `data:`, `http:`, protocol-relative and
 * backslash forms, and `https:host` without slashes, which WHATWG URL would repair but Go's
 * `url.Parse` reads as opaque. This is tronc's `safeUpgradeURL` rule, made stricter where
 * the two parsers disagree.
 */
export function isSafeHref(raw: unknown): raw is string {
    if (typeof raw !== 'string' || raw === '' || UNSAFE.test(raw)) return false;
    if (raw.startsWith('/')) return !raw.startsWith('//');
    if (!/^https:\/\/[^/]/i.test(raw)) return false;
    try {
        const url = new URL(raw);
        return url.protocol === 'https:' && url.host !== '' && !url.username && !url.password;
    } catch {
        return false;
    }
}

/** `href` when it passes `isSafeHref`, otherwise `fallback`. */
export function safeHref(href: unknown, fallback: string): string {
    return isSafeHref(href) ? href : fallback;
}

/**
 * `href` with `key=value` added to its query, unless the query already has `key`.
 * Works on same-origin paths and absolute URLs alike, and keeps the fragment.
 */
export function withParam(href: string, key: string, value: string): string {
    const relative = href.startsWith('/');
    const url = new URL(href, 'https://relative.invalid');
    if (url.searchParams.has(key)) return href;
    url.searchParams.set(key, value);
    return relative ? `${url.pathname}${url.search}${url.hash}` : url.toString();
}

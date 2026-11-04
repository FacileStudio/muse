export type PlanLimitError = {
    message?: string;
    upgrade_url?: string;
    key?: string;
    limit?: number | string;
};

type Envelope = Record<string, unknown>;

const isRecord = (value: unknown): value is Envelope => typeof value === 'object' && value !== null;

const text = (value: unknown): string | undefined =>
    typeof value === 'string' && value.trim() !== '' ? value : undefined;

const amount = (value: unknown): number | string | undefined =>
    typeof value === 'number' && Number.isFinite(value) ? value : text(value);

/**
 * True for a same-origin path or an https URL with a host and no credentials, the same rule
 * tronc's `WithUpgradeURL` applies server side. Anything else never reaches an `href`.
 */
export function isSafeUpgradeUrl(raw: string | undefined): raw is string {
    if (!raw || /[\s\\\p{Cc}]/u.test(raw)) return false;
    if (raw.startsWith('/')) return !raw.startsWith('//');
    try {
        const url = new URL(raw);
        return url.protocol === 'https:' && url.host !== '' && !url.username && !url.password;
    } catch {
        return false;
    }
}

/**
 * Reads a 402 response body into a `PlanLimitError`, or `null` when it is not one. Accepts
 * tronc's `{"error":{...}}` envelope and a bare `{message, upgrade_url, key, limit}`, and
 * drops an `upgrade_url` that fails `isSafeUpgradeUrl`.
 */
export function planLimitFrom(body: unknown): PlanLimitError | null {
    if (!isRecord(body)) return null;
    const inner = isRecord(body.error) ? body.error : body;
    const upgrade = text(inner.upgrade_url);
    const parsed: PlanLimitError = {
        message: text(inner.message),
        upgrade_url: isSafeUpgradeUrl(upgrade) ? upgrade : undefined,
        key: text(inner.key),
        limit: amount(inner.limit)
    };
    const empty = Object.values(parsed).every((v) => v === undefined);
    return empty ? null : parsed;
}

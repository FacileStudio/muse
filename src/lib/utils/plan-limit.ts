import { isSafeHref } from './href.js';

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

/** `isSafeHref`, under the name the 402 contract uses. */
export const isSafeUpgradeUrl = (raw: string | undefined): raw is string => isSafeHref(raw);

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

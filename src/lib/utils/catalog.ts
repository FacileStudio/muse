import { isSafeHref } from './href.js';

export type BillingInterval = 'month' | 'year';

export type CatalogPrice = { interval: BillingInterval; amount: number; currency: string; lookup_key: string };

export type FeatureValue = number | boolean;

export type CatalogPlan = { key: string; name: string; features: Record<string, FeatureValue>; prices: CatalogPrice[] };

export const CATALOG_URL = 'https://api-ardoise.facile.studio/api/catalog';

export const CATALOG_TIMEOUT_MS = 5000;

type Raw = Record<string, unknown>;

const isRecord = (value: unknown): value is Raw =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

const KEY = /^[a-z0-9][a-z0-9_.-]{0,63}$/i;

const isName = (value: unknown): value is string =>
    typeof value === 'string' && value.trim() !== '' && value.length <= 80;

/** One price, or `null` when any field is missing or out of range. */
export function parsePrice(raw: unknown): CatalogPrice | null {
    if (!isRecord(raw)) return null;
    const { interval, amount, currency, lookup_key } = raw;
    if (interval !== 'month' && interval !== 'year') return null;
    if (typeof amount !== 'number' || !Number.isSafeInteger(amount) || amount < 0) return null;
    if (typeof currency !== 'string' || !/^[a-z]{3}$/i.test(currency)) return null;
    if (typeof lookup_key !== 'string' || !KEY.test(lookup_key)) return null;
    return { interval, amount, currency: currency.toUpperCase(), lookup_key };
}

/** The feature entries with a usable value: a finite number (`-1` is unlimited) or a boolean. */
export function parseFeatures(raw: unknown): Record<string, FeatureValue> {
    if (!isRecord(raw)) return {};
    const out: Record<string, FeatureValue> = {};
    for (const [key, value] of Object.entries(raw)) {
        if (!KEY.test(key)) continue;
        if (typeof value === 'boolean' || (typeof value === 'number' && Number.isFinite(value))) out[key] = value;
    }
    return out;
}

/** One plan, or `null` when its key or name is unusable. Malformed prices are dropped. */
export function parsePlan(raw: unknown): CatalogPlan | null {
    if (!isRecord(raw) || typeof raw.key !== 'string' || !KEY.test(raw.key) || !isName(raw.name)) return null;
    const prices = (Array.isArray(raw.prices) ? raw.prices : [])
        .map(parsePrice)
        .filter((p): p is CatalogPrice => p !== null);
    const once = prices.filter((p, i) => prices.findIndex((q) => q.interval === p.interval) === i);
    return { key: raw.key, name: raw.name.trim(), features: parseFeatures(raw.features), prices: once };
}

/** The usable plans in a catalog body, first occurrence of each key. Anything else is `[]`. */
export function parseCatalog(body: unknown): CatalogPlan[] {
    if (!isRecord(body) || !Array.isArray(body.plans)) return [];
    const plans = body.plans.map(parsePlan).filter((p): p is CatalogPlan => p !== null);
    return plans.filter((p, i) => plans.findIndex((q) => q.key === p.key) === i);
}

export type FetchCatalogOptions = { timeoutMs?: number; signal?: AbortSignal; fetch?: typeof fetch };

/**
 * One request for the public catalog, aborted after `timeoutMs`. Never throws and never retries:
 * a failure, a timeout, a non-2xx status or an unsafe URL all come back as `[]`.
 */
export async function fetchCatalog(url: string = CATALOG_URL, options: FetchCatalogOptions = {}): Promise<CatalogPlan[]> {
    if (!isSafeHref(url)) return [];
    const timeout = new AbortController();
    const timer = setTimeout(() => timeout.abort(), options.timeoutMs ?? CATALOG_TIMEOUT_MS);
    const abort = () => timeout.abort();
    options.signal?.addEventListener('abort', abort, { once: true });
    try {
        const res = await (options.fetch ?? fetch)(url, { signal: timeout.signal, headers: { accept: 'application/json' } });
        return res.ok ? parseCatalog(await res.json()) : [];
    } catch {
        return [];
    } finally {
        clearTimeout(timer);
        options.signal?.removeEventListener('abort', abort);
    }
}

import type { MuseKey } from '../i18n/messages/index.js';
import type { BillingInterval, CatalogPlan, CatalogPrice, FeatureValue } from './catalog.js';

type FeatureLabel = { count?: MuseKey; unlimited?: MuseKey; on?: MuseKey };

export const FEATURE_LABELS: Readonly<Record<string, FeatureLabel>> = {
    'nuage.storage_gb': { count: 'feature.storage', unlimited: 'feature.storageUnlimited' },
    'courrier.mailboxes': { count: 'feature.mailboxes', unlimited: 'feature.mailboxesUnlimited' },
    'echo.max_call_minutes': { count: 'feature.callMinutes', unlimited: 'feature.callMinutesUnlimited' },
    'echo.max_participants': { count: 'feature.participants', unlimited: 'feature.participantsUnlimited' },
    'echo.recording': { on: 'feature.recording' },
    'glouton.access': { on: 'feature.glouton' }
};

export type FeatureRow = { key: string; message: MuseKey; count?: number };

/** The message for one feature value, or `null` for an unknown key, a zero or a `false`. */
export function featureRow(key: string, value: FeatureValue): FeatureRow | null {
    const label = FEATURE_LABELS[key];
    if (!label) return null;
    if (typeof value === 'boolean') return value && label.on ? { key, message: label.on } : null;
    if (value === -1 && label.unlimited) return { key, message: label.unlimited };
    if (value > 0 && label.count) return { key, message: label.count, count: value };
    return null;
}

/** The plan's known features as rows, `highlight` keys first in their given order, then catalog order. */
export function featureRows(plan: CatalogPlan, highlight: readonly string[] = []): FeatureRow[] {
    const rank = (key: string) => {
        const i = highlight.indexOf(key);
        return i === -1 ? highlight.length : i;
    };
    return Object.entries(plan.features)
        .map(([key, value]) => featureRow(key, value))
        .filter((row): row is FeatureRow => row !== null)
        .map((row, at) => ({ row, at }))
        .sort((a, b) => rank(a.row.key) - rank(b.row.key) || a.at - b.at)
        .map(({ row }) => row);
}

/** A plan with no price, or only zero prices. */
export const isFreePlan = (plan: CatalogPlan): boolean => plan.prices.every((p) => p.amount === 0);

/** The price for `interval`, falling back to the plan's other interval. */
export function priceFor(plan: CatalogPlan, interval: BillingInterval): CatalogPrice | undefined {
    return plan.prices.find((p) => p.interval === interval) ?? plan.prices[0];
}

/** The yearly saving over twelve monthly payments, as a 0–1 fraction, or 0 when there is none. */
export function yearlySaving(plan: CatalogPlan): number {
    const month = plan.prices.find((p) => p.interval === 'month');
    const year = plan.prices.find((p) => p.interval === 'year');
    if (!month || !year || month.currency !== year.currency || month.amount === 0) return 0;
    const saving = 1 - year.amount / (month.amount * 12);
    return saving > 0.005 ? saving : 0;
}

/** Paid plans as listed, with a free plan first: the catalog's own, or a synthetic one. */
export function withFreePlan(plans: CatalogPlan[]): CatalogPlan[] {
    if (plans.length === 0) return [];
    const free = plans.filter(isFreePlan);
    const paid = plans.filter((p) => !isFreePlan(p));
    const first = free[0] ?? { key: 'free', name: '', features: {}, prices: [] };
    return [first, ...paid];
}

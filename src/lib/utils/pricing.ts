import { museMessages, type MuseKey } from '../i18n/messages/index.js';
import type { BillingInterval, CatalogPlan, CatalogPrice, FeatureValue } from './catalog.js';

type FeatureLabel = { count?: MuseKey; unlimited?: MuseKey; on?: MuseKey };

export const FEATURE_LABELS: Readonly<Record<string, FeatureLabel>> = {
    'nuage.storage_gb': { count: 'feature.storage', unlimited: 'feature.storageUnlimited' },
    'courrier.mailboxes': { count: 'feature.mailboxes', unlimited: 'feature.mailboxesUnlimited' },
    'echo.max_call_minutes': { count: 'feature.callMinutes', unlimited: 'feature.callMinutesUnlimited' },
    'echo.max_participants': { count: 'feature.participants', unlimited: 'feature.participantsUnlimited' },
    'echo.recording': { on: 'feature.recording' },
    'glouton.access': { on: 'feature.glouton' },
    'ai.access': { on: 'feature.ai' }
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

/** A plan the catalog lists as free: no price at all (`parsePlan` drops broken ones), or only zero prices. */
export const isFreePlan = (plan: CatalogPlan): boolean => plan.prices.every((p) => p.amount === 0);

/** Whether a plan name is just the word "free" in any muse locale, so the card must not repeat it as a price. */
export function isFreeLabel(name: string): boolean {
    const value = name.trim().toLocaleLowerCase();
    return Object.values(museMessages).some((m) => String(m['pricing.free']).toLocaleLowerCase() === value);
}

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

/**
 * Every free plan the catalog lists, in catalog order, then the paid ones. With `synthesize`,
 * a bare free card is added first when the catalog lists paid plans and no free one.
 */
export function withFreePlan(plans: CatalogPlan[], synthesize = false): CatalogPlan[] {
    const free = plans.filter(isFreePlan);
    const paid = plans.filter((p) => !isFreePlan(p));
    const extra = synthesize && free.length === 0 && paid.length > 0;
    return [...(extra ? [{ key: 'free', name: '', features: {}, prices: [] }] : free), ...paid];
}

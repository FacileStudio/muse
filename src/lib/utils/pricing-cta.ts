import type { BillingInterval, CatalogPlan } from './catalog.js';
import { isSafeHref, withParam } from './href.js';
import { signUpUrl } from './legal.js';
import { isFreePlan, priceFor } from './pricing.js';

/** Where the buttons of `PricingPlans` go: the app's own target, the free plan's, and the locale for the sign-up default. */
export type PlanTargets = { ctaHref?: string; freeHref?: string; locale?: string | null };

/**
 * Where one card's button goes. Without a safe `ctaHref`, every button opens Registre's sign-up
 * page in `locale`: a visitor on a landing page has no account yet, and Registre keeps no plan
 * through sign-up, so no `plan` is added. A safe `ctaHref` gains `plan` and `interval` on a paid
 * plan with a price. A safe `freeHref` replaces the target of free plans only.
 */
export function planHref(plan: CatalogPlan, interval: BillingInterval, targets: PlanTargets = {}): string {
    const own = isSafeHref(targets.ctaHref) ? targets.ctaHref : undefined;
    const base = own ?? signUpUrl(targets.locale);
    if (isFreePlan(plan)) return isSafeHref(targets.freeHref) ? targets.freeHref : base;
    const price = priceFor(plan, interval);
    return own && price ? withParam(withParam(own, 'plan', plan.key), 'interval', price.interval) : base;
}

/** A paid button label: one string for every plan, or one per plan key with `'*'` for the rest. Blank means the default. */
export function planLabel(label: string | Readonly<Record<string, string>> | undefined, key: string): string | undefined {
    const value = typeof label === 'string' ? label : (label?.[key] ?? label?.['*']);
    return value?.trim() ? value : undefined;
}

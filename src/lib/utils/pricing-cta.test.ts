import { describe, expect, test } from 'bun:test';
import { planHref, planLabel } from './pricing-cta.js';

const solo = { key: 'solo', name: 'Solo', features: {}, prices: [] };
const pro = {
    key: 'pro',
    name: 'Pro',
    features: {},
    prices: [
        { interval: 'month' as const, amount: 900, currency: 'EUR', lookup_key: 'pro_month' },
        { interval: 'year' as const, amount: 9000, currency: 'EUR', lookup_key: 'pro_year' }
    ]
};
const team = { key: 'team', name: 'Team', features: {}, prices: [{ interval: 'month' as const, amount: 1900, currency: 'EUR', lookup_key: 't' }] };

describe('planHref', () => {
    test('without ctaHref every button opens Registre sign-up in the locale, with no plan', () => {
        expect(planHref(solo, 'month', { locale: 'fr' })).toBe('https://sso.facile.studio/signup?lang=fr');
        expect(planHref(pro, 'year', { locale: 'de-DE' })).toBe('https://sso.facile.studio/signup?lang=de');
        expect(planHref(pro, 'month')).toBe('https://sso.facile.studio/signup');
        expect(planHref(pro, 'month', { ctaHref: 'javascript:alert(1)', locale: 'en' })).toBe('https://sso.facile.studio/signup?lang=en');
    });

    test('a safe ctaHref keeps today behaviour: plan and interval on paid plans, bare on free', () => {
        const ctaHref = 'https://sso.facile.studio/spaces';
        expect(planHref(solo, 'month', { ctaHref, locale: 'fr' })).toBe(ctaHref);
        expect(planHref(pro, 'year', { ctaHref })).toBe('https://sso.facile.studio/spaces?plan=pro&interval=year');
        expect(planHref(team, 'year', { ctaHref: '/signup' })).toBe('/signup?plan=team&interval=month');
    });

    test('freeHref replaces the free plan target only, and only when safe', () => {
        expect(planHref(solo, 'month', { freeHref: '#form', locale: 'fr' })).toBe('https://sso.facile.studio/signup?lang=fr');
        expect(planHref(solo, 'month', { freeHref: '/new', locale: 'fr' })).toBe('/new');
        expect(planHref(pro, 'month', { freeHref: '/new', locale: 'fr' })).toBe('https://sso.facile.studio/signup?lang=fr');
        expect(planHref(solo, 'month', { ctaHref: '/go', freeHref: '/new' })).toBe('/new');
    });
});

describe('planLabel', () => {
    test('one string for every plan, a map with a * fallback, blank means default', () => {
        expect(planLabel(undefined, 'pro')).toBeUndefined();
        expect(planLabel('Voir les offres', 'pro')).toBe('Voir les offres');
        expect(planLabel({ pro: 'Essayer Pro', '*': 'Voir les offres' }, 'pro')).toBe('Essayer Pro');
        expect(planLabel({ pro: 'Essayer Pro', '*': 'Voir les offres' }, 'studio')).toBe('Voir les offres');
        expect(planLabel({ pro: 'Essayer Pro' }, 'studio')).toBeUndefined();
        expect(planLabel('  ', 'pro')).toBeUndefined();
    });
});

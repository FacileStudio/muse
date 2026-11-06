import { describe, expect, test } from 'bun:test';
import { museMessages } from '../i18n/messages/index.js';
import { createTranslator } from '../i18n/translate.js';
import { fetchCatalog, parseCatalog } from './catalog.js';
import { featureRows, withFreePlan, yearlySaving } from './pricing.js';
import { formatPrice } from './money.js';

const pro = {
    key: 'pro',
    name: 'Pro',
    features: { 'nuage.storage_gb': 200, 'courrier.mailboxes': -1, 'echo.recording': true, 'glouton.access': false, 'x.unknown': 3 },
    prices: [
        { interval: 'month', amount: 900, currency: 'eur', lookup_key: 'pro_month' },
        { interval: 'year', amount: 9000, currency: 'eur', lookup_key: 'pro_year' }
    ]
};

describe('parseCatalog', () => {
    test('keeps valid plans and drops malformed entries', () => {
        const plans = parseCatalog({
            plans: [
                pro,
                { key: 'pro', name: 'Duplicate', prices: [] },
                { key: '<script>', name: 'Bad key', prices: [] },
                { key: 'nameless', prices: [] },
                'nope',
                {
                    key: 'team',
                    name: 'Team',
                    features: { 'echo.max_participants': '50', 'echo.max_call_minutes': Infinity },
                    prices: [
                        { interval: 'week', amount: 1, currency: 'eur', lookup_key: 'w' },
                        { interval: 'month', amount: 12.5, currency: 'eur', lookup_key: 'm' },
                        { interval: 'month', amount: -1, currency: 'eur', lookup_key: 'm' },
                        { interval: 'month', amount: 1900, currency: 'euro', lookup_key: 'm' },
                        { interval: 'month', amount: 1900, currency: 'eur', lookup_key: 'team_month' }
                    ]
                }
            ]
        });
        expect(plans.map((p) => p.key)).toEqual(['pro', 'team']);
        expect(plans[1].features).toEqual({});
        expect(plans[1].prices).toEqual([{ interval: 'month', amount: 1900, currency: 'EUR', lookup_key: 'team_month' }]);
        expect(parseCatalog(null)).toEqual([]);
        expect(parseCatalog({ plans: {} })).toEqual([]);
    });
});

describe('pricing helpers', () => {
    const [plan] = parseCatalog({ plans: [pro] });

    test('a free plan always comes first, synthetic or listed, and nothing for an empty catalog', () => {
        expect(withFreePlan([])).toEqual([]);
        expect(withFreePlan([plan]).map((p) => p.key)).toEqual(['free', 'pro']);
        const listed = { key: 'starter', name: 'Starter', features: {}, prices: [] };
        expect(withFreePlan([plan, listed]).map((p) => p.key)).toEqual(['starter', 'pro']);
    });

    test('yearly saving and currency per locale', () => {
        expect(yearlySaving(plan)).toBeCloseTo(1 / 6, 5);
        expect(formatPrice(900, 'EUR', 'fr')).toBe('9 €');
        expect(formatPrice(999, 'EUR', 'en')).toBe('€9.99');
        expect(formatPrice(900, 'EUR', 'de')).toBe('9 €');
    });

    test('known features only, unlimited, highlight first', () => {
        const fr = createTranslator(museMessages, 'fr');
        const rows = featureRows(plan, ['echo.recording']);
        expect(rows.map((r) => r.key)).toEqual(['echo.recording', 'nuage.storage_gb', 'courrier.mailboxes']);
        expect(rows.map((r) => fr(r.message, r.count === undefined ? undefined : { count: r.count }))).toEqual([
            'Enregistrement des appels',
            '200 Go de stockage',
            'Boîtes mail illimitées'
        ]);
    });
});

describe('fetchCatalog', () => {
    const ok = (body: unknown) => (async () => new Response(JSON.stringify(body))) as unknown as typeof fetch;

    test('returns [] on failure, bad status, bad JSON, unsafe URL and timeout, with one request', async () => {
        let calls = 0;
        const failing = (async () => {
            calls += 1;
            throw new Error('down');
        }) as unknown as typeof fetch;
        expect(await fetchCatalog('https://x.test/c', { fetch: failing })).toEqual([]);
        expect(calls).toBe(1);
        expect(await fetchCatalog('https://x.test/c', { fetch: (async () => new Response('', { status: 500 })) as unknown as typeof fetch })).toEqual([]);
        expect(await fetchCatalog('https://x.test/c', { fetch: (async () => new Response('{')) as unknown as typeof fetch })).toEqual([]);
        expect(await fetchCatalog('javascript:alert(1)', { fetch: ok({ plans: [pro] }) })).toEqual([]);
        const hanging = ((_: string, init: RequestInit) =>
            new Promise((_, reject) => init.signal?.addEventListener('abort', () => reject(new Error('abort'))))) as unknown as typeof fetch;
        expect(await fetchCatalog('https://x.test/c', { fetch: hanging, timeoutMs: 20 })).toEqual([]);
        expect((await fetchCatalog('https://x.test/c', { fetch: ok({ plans: [pro] }) })).map((p) => p.key)).toEqual(['pro']);
    });
});

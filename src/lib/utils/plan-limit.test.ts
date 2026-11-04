import { describe, expect, test } from 'bun:test';
import { isSafeUpgradeUrl, planLimitFrom } from './plan-limit.js';
import { legalUrl, signUpUrl } from './legal.js';

describe('planLimitFrom', () => {
    test('reads tronc envelope and bare body', () => {
        const wire = { error: { code: 'payment_required', message: 'Quota', upgrade_url: '/billing' } };
        expect(planLimitFrom(wire)).toEqual({ message: 'Quota', upgrade_url: '/billing', key: undefined, limit: undefined });
        expect(planLimitFrom({ upgrade_url: 'https://x.facile.studio/p', key: 'files', limit: '5' })?.limit).toBe('5');
        expect(planLimitFrom(null)).toBeNull();
        expect(planLimitFrom({})).toBeNull();
    });

    test('never lets an unsafe url through', () => {
        for (const bad of ['javascript:alert(1)', '//evil.example', 'http://x.test', 'https://u:p@x.test', '/a b', '']) {
            expect(isSafeUpgradeUrl(bad)).toBe(false);
        }
        expect(planLimitFrom({ upgrade_url: 'javascript:alert(1)', message: 'm' })?.upgrade_url).toBeUndefined();
    });
});

describe('legal urls', () => {
    test('defaults to Registre with the locale', () => {
        expect(legalUrl('privacy', 'de')).toBe('https://sso.facile.studio/legal/privacy?lang=de');
        expect(legalUrl('cgu', 'fr', 'https://r.test/legal/')).toBe('https://r.test/legal/cgu?lang=fr');
        expect(signUpUrl('es')).toBe('https://sso.facile.studio/signup?lang=es');
    });
});

import { describe, expect, test } from 'bun:test';
import { isSafeHref, safeHref, withParam } from './href.js';
import { isSafeUpgradeUrl } from './plan-limit.js';
import { legalUrl, signUpUrl } from './legal.js';
import { staticI18n } from '../i18n/context.svelte.js';

const BAD = [
    'javascript:alert(1)',
    'JaVaScRiPt:alert(1)',
    'data:text/html,<script>1</script>',
    'vbscript:x',
    'http://x.test',
    '//evil.example',
    '/\\evil.example',
    '\\\\evil.example',
    'https:evil.example',
    'https:/evil.example',
    'https:\\\\evil.example',
    'https://u:p@x.test',
    'https://',
    ' /a',
    '/a b',
    '/a\n',
    '#/launch',
    '',
    undefined,
    42
];

describe('isSafeHref', () => {
    test('accepts same-origin paths and https URLs', () => {
        for (const ok of ['/auth/oidc', '/billing?plan=pro', 'https://sso.facile.studio/signup?lang=fr', 'HTTPS://x.test']) {
            expect(isSafeHref(ok)).toBe(true);
        }
    });

    test('rejects script, data, protocol-relative, backslash and opaque https forms', () => {
        for (const bad of BAD) expect(`${String(bad)}:${isSafeHref(bad)}`).toBe(`${String(bad)}:false`);
    });

    test('isSafeUpgradeUrl is the same rule', () => {
        for (const bad of BAD) expect(isSafeUpgradeUrl(bad as string)).toBe(false);
        expect(isSafeUpgradeUrl('/billing')).toBe(true);
    });

    test('safeHref falls back', () => {
        expect(safeHref('javascript:alert(1)', '/auth/oidc')).toBe('/auth/oidc');
        expect(safeHref('https:evil.example', '/auth/oidc')).toBe('/auth/oidc');
        expect(safeHref('/custom', '/auth/oidc')).toBe('/custom');
    });
});

describe('url builders resist injection', () => {
    test('legalUrl never lets the locale add a parameter', () => {
        expect(legalUrl('cgu', 'fr&next=https://evil.com')).toBe('https://sso.facile.studio/legal/cgu');
        expect(legalUrl('cgu', 'fr')).toBe('https://sso.facile.studio/legal/cgu?lang=fr');
        expect(legalUrl('privacy', 'de', 'javascript:alert(1)//')).toBe('https://sso.facile.studio/legal/privacy?lang=de');
        expect(legalUrl('cgv', 'es', 'https://r.test/legal/?x=1')).toBe('https://r.test/legal/cgv?lang=es');
    });

    test('signUpUrl resolves the locale and rejects an unsafe base', () => {
        expect(signUpUrl('de-DE')).toBe('https://sso.facile.studio/signup?lang=de');
        expect(signUpUrl('x"><script>')).toBe('https://sso.facile.studio/signup');
        expect(signUpUrl('fr', 'javascript:alert(1)')).toBe('https://sso.facile.studio/signup?lang=fr');
    });

    test('a stored locale is always one of the four', () => {
        expect(staticI18n('fr"><img src=x>').locale).toBe('en');
        expect(staticI18n('es-MX').locale).toBe('es');
    });
});

describe('unknown locale and sign-in params', () => {
    test('no known locale omits ?lang= so Registre uses the browser languages', () => {
        expect(legalUrl('privacy')).toBe('https://sso.facile.studio/legal/privacy');
        expect(legalUrl('privacy', null)).toBe('https://sso.facile.studio/legal/privacy');
        expect(signUpUrl()).toBe('https://sso.facile.studio/signup');
        expect(legalUrl('cgu', 'it, de;q=0.8')).toBe('https://sso.facile.studio/legal/cgu?lang=de');
    });

    test('withParam adds ui_locales without clobbering', () => {
        expect(withParam('/auth/oidc', 'ui_locales', 'fr')).toBe('/auth/oidc?ui_locales=fr');
        expect(withParam('/auth/oidc?next=%2Fx#top', 'ui_locales', 'de')).toBe('/auth/oidc?next=%2Fx&ui_locales=de#top');
        expect(withParam('/auth/oidc?ui_locales=es', 'ui_locales', 'fr')).toBe('/auth/oidc?ui_locales=es');
        expect(withParam('https://porte.test/auth/oidc', 'ui_locales', 'en')).toBe('https://porte.test/auth/oidc?ui_locales=en');
    });

    test('the fallback I18n is not a known locale', () => {
        expect(staticI18n().known).toBe(false);
        expect(staticI18n('fr').known).toBe(true);
        expect(staticI18n('it').known).toBe(false);
    });
});

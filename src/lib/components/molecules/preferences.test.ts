import { describe, expect, test } from 'bun:test';
import { render } from 'svelte/server';
import { offeredLocales } from '../../i18n/offered.js';
import LocaleSwitch from './LocaleSwitch.svelte';
import PreferencesSection from './PreferencesSection.svelte';

const body = (props: Record<string, unknown> = {}) => render(PreferencesSection, { props }).body;

describe('PreferencesSection', () => {
    test('shows language and the three theme choices by default', () => {
        const html = body();
        expect(html).toContain('Language');
        expect(html.match(/role="radio"/g)).toHaveLength(3);
        for (const label of ['System', 'Light', 'Dark']) expect(html).toContain(label);
        expect(html).not.toContain('Manage subscription');
    });

    test('showLanguage and showTheme hide their rows', () => {
        const html = body({ showLanguage: false, showTheme: false });
        expect(html).not.toContain('Language');
        expect(html).not.toContain('role="radio"');
    });

    test('a subscription adds the plan name and the manage link', () => {
        const html = body({ subscription: { plan: 'Pro', href: '/billing' } });
        expect(html).toContain('Pro');
        expect(html).toContain('href="/billing"');
        expect(html).toContain('Manage subscription');
    });

    test('a subscription without a plan shows only its link, and a custom label wins', () => {
        const html = body({ subscription: { href: '/billing', label: 'Billing portal' } });
        expect(html).toContain('Billing portal');
        expect(html).not.toContain('Manage subscription');
    });

    test('an unsafe subscription href renders no link', () => {
        const html = body({ subscription: { plan: 'Pro', href: 'javascript:alert(1)' } });
        expect(html).not.toContain('javascript:');
    });

    test('locales narrows the language choice in the given order', () => {
        const html = render(LocaleSwitch, { props: { locales: ['en', 'fr', 'en'] } }).body;
        expect(html.match(/<option value="(\w+)"/g)).toEqual(['<option value="en"', '<option value="fr"']);
    });
});

describe('offeredLocales', () => {
    test('drops duplicates and unknown values, and falls back to all four', () => {
        expect(offeredLocales(['en', 'fr', 'en'])).toEqual(['en', 'fr']);
        expect(offeredLocales([])).toEqual(['fr', 'en', 'es', 'de']);
        expect(offeredLocales(['it'])).toEqual(['fr', 'en', 'es', 'de']);
        expect(offeredLocales(null)).toEqual(['fr', 'en', 'es', 'de']);
    });
});

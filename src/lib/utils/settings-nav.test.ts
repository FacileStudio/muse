import { describe, expect, test } from 'bun:test';
import { orderSections, sectionHref, settingsRoute } from './settings-nav.js';

const ids = (list: { id: string }[]) => list.map((s) => s.id);

describe('orderSections', () => {
    test('canonical sections sort into the documented order', () => {
        const shuffled = ['advanced', 'tokens', 'profile', 'subscription', 'notifications', 'preferences'].map((id) => ({ id }));
        expect(ids(orderSections(shuffled))).toEqual(['profile', 'preferences', 'notifications', 'tokens', 'subscription', 'advanced']);
    });

    test('app sections land between notifications and tokens, in the order given', () => {
        const mixed = ['advanced', 'bus', 'profile', 'tokens', 'accounts', 'preferences'].map((id) => ({ id }));
        expect(ids(orderSections(mixed))).toEqual(['profile', 'preferences', 'bus', 'accounts', 'tokens', 'advanced']);
    });

    test('it does not mutate its input', () => {
        const input = [{ id: 'advanced' }, { id: 'profile' }];
        orderSections(input);
        expect(ids(input)).toEqual(['advanced', 'profile']);
    });
});

describe('settingsRoute', () => {
    const sections = [{ id: 'profile' }, { id: 'tokens' }];

    test('the bare URL shows the first panel on desktop and the list on a phone', () => {
        expect(settingsRoute(undefined, sections)).toEqual({ current: 'profile', drilled: false, known: true });
        expect(settingsRoute('', sections)).toEqual({ current: 'profile', drilled: false, known: true });
    });

    test('a named section drills in', () => {
        expect(settingsRoute('tokens', sections)).toEqual({ current: 'tokens', drilled: true, known: true });
    });

    test('an unknown section falls back and says so', () => {
        expect(settingsRoute('bogus', sections)).toEqual({ current: 'profile', drilled: false, known: false });
    });
});

describe('sectionHref', () => {
    test('joins without doubling the slash', () => {
        expect(sectionHref('/settings/', 'api')).toBe('/settings/api');
        expect(sectionHref('/settings', 'api')).toBe('/settings/api');
    });
});

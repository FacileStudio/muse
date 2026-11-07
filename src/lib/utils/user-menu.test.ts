import { describe, expect, test } from 'bun:test';
import { fr } from '../i18n/messages/fr.js';
import { actionable, drillKey, startIndex, userMenuRows, type UserMenuLabels, type UserMenuModel, type UserMenuOptions, type UserMenuView } from './user-menu.js';

const labels: UserMenuLabels = {
    account: 'Account',
    settings: 'Settings',
    manageSubscription: 'Manage',
    language: 'Language',
    theme: 'Theme',
    help: 'Help',
    signOut: 'Sign out',
    back: 'Back',
    system: 'System',
    light: 'Light',
    dark: 'Dark'
};

function model(options: UserMenuOptions = {}, view: UserMenuView = 'root'): UserMenuModel {
    return { view, labels, options, locale: 'fr', theme: 'dark', onLocale: () => undefined, onTheme: () => undefined };
}

const full: UserMenuOptions = {
    items: [{ label: 'Downloads', href: '/dl' }],
    accountHref: 'https://sso.facile.studio/account',
    settingsHref: '/settings',
    subscription: { plan: 'Pro', href: '/billing' },
    helpHref: '/help',
    onSignOut: () => undefined
};

describe('userMenuRows', () => {
    test('root order: account, app items, settings, subscription, language, theme, help, gap, sign out', () => {
        const ids = userMenuRows(model(full)).map((row) => row.id);
        expect(ids).toEqual(['account', 'item-0', 'settings', 'subscription', 'language', 'theme', 'help', 'gap', 'signOut']);
    });

    test('a null href or a missing handler removes the row', () => {
        const rows = userMenuRows(model({ accountHref: null, settingsHref: '/s' }));
        expect(rows.map((row) => row.id)).toEqual(['settings', 'language', 'theme']);
    });

    test('the sign out row is danger, and the gap is the only separator', () => {
        const rows = userMenuRows(model(full));
        expect(rows.find((row) => row.id === 'signOut')?.tone).toBe('danger');
        expect(rows.filter((row) => row.kind === 'gap')).toHaveLength(1);
    });

    test('the account link is external and the subscription carries the plan', () => {
        const rows = userMenuRows(model(full));
        expect(rows[0]).toMatchObject({ external: true, href: 'https://sso.facile.studio/account' });
        expect(rows.find((row) => row.id === 'subscription')).toMatchObject({ detail: 'Pro', label: 'Manage' });
    });

    test('language and theme can be hidden', () => {
        const rows = userMenuRows(model({ showLanguage: false, showTheme: false }));
        expect(rows).toEqual([]);
    });

    test('the language view lists the four locales and checks the current one', () => {
        const rows = userMenuRows(model({}, 'language'));
        expect(rows.map((row) => row.id)).toEqual(['back', 'fr', 'en', 'es', 'de']);
        expect(rows.filter((row) => row.checked).map((row) => row.id)).toEqual(['fr']);
    });

    test('locales narrows the language view and keeps the given order', () => {
        const ids = (locales: UserMenuOptions['locales']) => userMenuRows(model({ locales }, 'language')).map((row) => row.id);
        expect(ids(['fr', 'en'])).toEqual(['back', 'fr', 'en']);
        expect(ids(['en', 'fr', 'en'])).toEqual(['back', 'en', 'fr']);
        expect(ids([])).toEqual(['back', 'fr', 'en', 'es', 'de']);
        expect(ids(['it'] as never)).toEqual(['back', 'fr', 'en', 'es', 'de']);
    });

    test('a subscription without a plan shows only its label', () => {
        const row = userMenuRows(model({ subscription: { href: '/billing' } })).find((r) => r.id === 'subscription');
        expect(row).toMatchObject({ label: 'Manage', href: '/billing' });
        expect(row?.detail).toBeUndefined();
        const empty = userMenuRows(model({ subscription: { plan: '', href: '/billing' } })).find((r) => r.id === 'subscription');
        expect(empty?.detail).toBeUndefined();
    });

    test('the theme view checks the current theme and a radio runs its callback', () => {
        let picked = '';
        const rows = userMenuRows({ ...model({}, 'theme'), onTheme: (t) => (picked = t) });
        expect(rows.filter((row) => row.checked).map((row) => row.id)).toEqual(['dark']);
        rows.find((row) => row.id === 'light')?.run?.();
        expect(picked).toBe('light');
    });
});

describe('keyboard', () => {
    test('focus starts on the checked choice, skipping the gap', () => {
        const rows = userMenuRows(model({}, 'language'));
        expect(startIndex(rows)).toBe(1);
        expect(actionable(userMenuRows(model(full))).some((row) => row.kind === 'gap')).toBe(false);
    });

    test('right arrow enters a submenu and only there', () => {
        expect(drillKey('root', 'submenu', 'ArrowRight')).toBe('enter');
        expect(drillKey('root', 'item', 'ArrowRight')).toBeNull();
        expect(drillKey('root', 'submenu', 'ArrowLeft')).toBeNull();
    });

    test('left arrow and escape leave a submenu', () => {
        expect(drillKey('language', 'radio', 'ArrowLeft')).toBe('leave');
        expect(drillKey('theme', 'back', 'Escape')).toBe('leave');
        expect(drillKey('theme', 'radio', 'ArrowDown')).toBeNull();
    });
});

describe('catalog', () => {
    test('the menu title the card promises is French by default', () => {
        expect(fr['userMenu.account']).toBe('Gérer mon compte Facile');
        expect(fr['userMenu.manageSubscription']).toBe("Gérer l'abonnement");
    });
});

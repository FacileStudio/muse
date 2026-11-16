import { describe, expect, test } from 'bun:test';
import { fr } from '../i18n/messages/fr.js';
import { actionable, pendingInvitations, userMenuRows, type UserMenuLabels, type UserMenuModel, type UserMenuOptions } from './user-menu.js';

const labels: UserMenuLabels = {
    account: 'Account',
    invitations: 'Invitations',
    settings: 'Settings',
    help: 'Help',
    signOut: 'Sign out'
};

function model(options: UserMenuOptions = {}): UserMenuModel {
    return { labels, options };
}

const full: UserMenuOptions = {
    accountHref: 'https://sso.facile.studio/account',
    settingsHref: '/settings',
    helpHref: '/help',
    onSignOut: () => undefined
};

const deprecated: UserMenuOptions = {
    items: [{ label: 'Downloads', href: '/dl' }, { label: 'Spaces', onSelect: () => undefined }],
    subscription: { plan: 'Pro', href: '/billing' },
    showLanguage: true,
    locales: ['fr', 'en'],
    locale: 'fr',
    onLocaleChange: () => undefined,
    showTheme: true,
    theme: 'dark',
    onThemeChange: () => undefined
};

describe('userMenuRows', () => {
    test('invitations sit after account with a count, and an absolute href opens a new tab', () => {
        const rows = userMenuRows(model({ ...full, invitations: { count: 3, href: 'https://sso.facile.studio/spaces' } }));
        expect(rows.map((row) => row.id).slice(0, 3)).toEqual(['account', 'invitations', 'settings']);
        expect(rows[1]).toMatchObject({ label: 'Invitations', count: 3, external: true, href: 'https://sso.facile.studio/spaces' });
    });

    test('no invitations prop, a zero count or no href shows no row', () => {
        const ids = (invitations: UserMenuOptions['invitations']) => userMenuRows(model({ ...full, invitations })).map((row) => row.id);
        expect(ids(undefined)).not.toContain('invitations');
        expect(ids(null)).not.toContain('invitations');
        expect(ids({ count: 0, href: '/invitations' })).not.toContain('invitations');
        expect(ids({ count: -2, href: '/invitations' })).not.toContain('invitations');
        expect(ids({ count: 1, href: '' })).not.toContain('invitations');
    });

    test('a custom invitations label is used while any are pending', () => {
        const rows = userMenuRows(model({ invitations: { count: 1, href: '/invitations', label: 'Invites' } }));
        expect(rows[0]).toMatchObject({ id: 'invitations', label: 'Invites', external: false, count: 1 });
    });

    test('pendingInvitations ignores negative and invalid counts', () => {
        expect(pendingInvitations({ count: 2, href: '/' })).toBe(2);
        expect(pendingInvitations({ count: -1, href: '/' })).toBe(0);
        expect(pendingInvitations({ count: Number.NaN, href: '/' })).toBe(0);
        expect(pendingInvitations(null)).toBe(0);
    });

    test('root order: account, invitations, settings, help, gap, sign out', () => {
        const ids = userMenuRows(model({ ...full, invitations: { count: 1, href: '/i' } })).map((row) => row.id);
        expect(ids).toEqual(['account', 'invitations', 'settings', 'help', 'gap', 'signOut']);
    });

    test('the menu never renders more than its five rows, whatever options are passed', () => {
        const rows = userMenuRows(model({ ...full, ...deprecated, invitations: { count: 4, href: '/i' } }));
        expect(actionable(rows).map((row) => row.id)).toEqual(['account', 'invitations', 'settings', 'help', 'signOut']);
        expect(rows.map((row) => row.label)).not.toContain('Downloads');
    });

    test('a null href or a missing handler removes the row', () => {
        const rows = userMenuRows(model({ accountHref: null, settingsHref: '/s' }));
        expect(rows.map((row) => row.id)).toEqual(['settings']);
        expect(userMenuRows(model())).toEqual([]);
    });

    test('the sign out row is danger, and the gap is the only separator', () => {
        const rows = userMenuRows(model(full));
        expect(rows.find((row) => row.id === 'signOut')?.tone).toBe('danger');
        expect(rows.filter((row) => row.kind === 'gap')).toHaveLength(1);
    });

    test('the account and help links are external', () => {
        const rows = userMenuRows(model(full));
        expect(rows[0]).toMatchObject({ external: true, href: 'https://sso.facile.studio/account' });
        expect(rows.find((row) => row.id === 'help')).toMatchObject({ external: true, href: '/help' });
        expect(rows.find((row) => row.id === 'settings')?.external).toBeFalsy();
    });
});

describe('keyboard', () => {
    test('the gap is not a stop', () => {
        expect(actionable(userMenuRows(model(full))).some((row) => row.kind === 'gap')).toBe(false);
    });
});

describe('catalog', () => {
    test('the menu title the card promises is French by default', () => {
        expect(fr['userMenu.account']).toBe('Gérer mon compte Facile');
        expect(fr['userMenu.manageSubscription']).toBe("Gérer l'abonnement");
    });
});

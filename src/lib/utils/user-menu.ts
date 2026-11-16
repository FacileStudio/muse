import { icons } from '../icons.js';
import type { Locale } from '../i18n/locale.js';
import type { Theme } from './theme.js';
import { invitationsRow } from './user-menu-invitations.js';

export const ACCOUNT_URL = 'https://sso.facile.studio/account';

export type UserMenuLabels = {
    account: string;
    invitations: string;
    settings: string;
    help: string;
    signOut: string;
    /** @deprecated The menu no longer has this row. Ignored. */
    manageSubscription?: string;
    /** @deprecated The menu no longer has this row. Ignored. */
    language?: string;
    /** @deprecated The menu no longer has this row. Ignored. */
    theme?: string;
    /** @deprecated The menu no longer has submenus. Ignored. */
    back?: string;
    /** @deprecated The menu no longer has this row. Ignored. */
    system?: string;
    /** @deprecated The menu no longer has this row. Ignored. */
    light?: string;
    /** @deprecated The menu no longer has this row. Ignored. */
    dark?: string;
};

/**
 * One app-specific row.
 * @deprecated The menu shows no app rows since the slim menu. Put the target in a settings section or in the sidebar.
 */
export type UserMenuItem = {
    label: string;
    icon?: string;
    href?: string;
    onSelect?: () => void;
    tone?: 'default' | 'danger';
};

/** The signed-in person's pending space invitations, from Registre. `href` opens them (Registre's /spaces page or one invitation's page). */
export type UserMenuInvitations = {
    count: number;
    href: string;
    label?: string;
};

/** The plan row of the settings preferences block (`PreferencesSection`). The menu itself no longer shows it. */
export type UserMenuSubscription = {
    /** The plan name shown beside the row. Leave it out when the app has no plan data: the row then shows only its label. */
    plan?: string;
    href: string;
    label?: string;
};

export type UserMenuOptions = {
    /** Which edge of the trigger the popover lines up with. `auto` keeps the left edge unless it would leave the screen. */
    align?: 'start' | 'end' | 'auto';
    /** @deprecated Ignored: the menu shows Account, Invitations, Settings, Help and Sign out only. */
    items?: UserMenuItem[];
    accountHref?: string | null;
    /** Adds an Invitations row after Account, with a count pill and a dot on the avatar, only while `count` is above 0. */
    invitations?: UserMenuInvitations | null;
    settingsHref?: string | null;
    /** @deprecated Ignored by the menu. Pass it to `PreferencesSection` on the settings page. */
    subscription?: UserMenuSubscription | null;
    helpHref?: string | null;
    onSignOut?: (() => void) | null;
    /** @deprecated Ignored by the menu. Language lives in `PreferencesSection`. */
    showLanguage?: boolean;
    /** @deprecated Ignored by the menu. Pass it to `PreferencesSection`. */
    locales?: Locale[];
    /** @deprecated Ignored by the menu. */
    locale?: Locale;
    /** @deprecated Ignored by the menu. Pass it to `PreferencesSection`. */
    onLocaleChange?: (locale: Locale) => void;
    /** @deprecated Ignored by the menu. Theme lives in `PreferencesSection`. */
    showTheme?: boolean;
    /** @deprecated Ignored by the menu. Pass it to `PreferencesSection`. */
    theme?: Theme;
    /** @deprecated Ignored by the menu. Pass it to `PreferencesSection`. */
    onThemeChange?: (theme: Theme) => void;
    labels?: Partial<UserMenuLabels>;
};

export type UserMenuRow = {
    id: string;
    kind: 'item' | 'gap';
    label: string;
    icon?: string;
    /** A count pill after the label, capped at 99+. */
    count?: number;
    href?: string;
    external?: boolean;
    tone?: 'default' | 'danger';
    run?: () => void;
};

export type UserMenuModel = {
    labels: UserMenuLabels;
    options: UserMenuOptions;
};

const GAP: UserMenuRow = { id: 'gap', kind: 'gap', label: '' };

function linkRow(id: string, label: string, icon: string, href: string | null | undefined, external = false): UserMenuRow[] {
    return href ? [{ id, kind: 'item', label, icon, href, external }] : [];
}

function footerRows(model: UserMenuModel): UserMenuRow[] {
    const { labels, options } = model;
    const rows = linkRow('help', labels.help, icons.help, options.helpHref, true);
    if (!options.onSignOut) return rows;
    return [...rows, GAP, { id: 'signOut', kind: 'item', label: labels.signOut, icon: icons.logout, tone: 'danger', run: options.onSignOut }];
}

/** The rows of the menu, in the one canonical order: Account, Invitations (while any are pending), Settings, Help, gap, Sign out. */
export function userMenuRows(model: UserMenuModel): UserMenuRow[] {
    const { labels, options } = model;
    return [
        ...linkRow('account', labels.account, icons.userCircle, options.accountHref, true),
        ...invitationsRow(model),
        ...linkRow('settings', labels.settings, icons.settings, options.settingsHref),
        ...footerRows(model)
    ];
}

/** The rows a keyboard can land on: everything but the spacing gap. */
export function actionable(rows: UserMenuRow[]): UserMenuRow[] {
    return rows.filter((row) => row.kind !== 'gap');
}

export { pendingInvitations, triggerLabel } from './user-menu-invitations.js';

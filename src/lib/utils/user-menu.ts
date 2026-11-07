import { LOCALES, LOCALE_NAMES, isLocale, type Locale } from '../i18n/locale.js';
import { icons } from '../icons.js';
import { THEMES, type Theme } from './theme.js';

export const ACCOUNT_URL = 'https://sso.facile.studio/account';

export type UserMenuView = 'root' | 'language' | 'theme';

export type UserMenuLabels = {
    account: string;
    settings: string;
    manageSubscription: string;
    language: string;
    theme: string;
    help: string;
    signOut: string;
    back: string;
    system: string;
    light: string;
    dark: string;
};

/** One app-specific row, shown before Settings: a link when `href` is set, otherwise a button calling `onSelect`. */
export type UserMenuItem = {
    label: string;
    icon?: string;
    href?: string;
    onSelect?: () => void;
    tone?: 'default' | 'danger';
};

export type UserMenuSubscription = {
    /** The plan name shown beside the row. Leave it out when the app has no plan data: the row then shows only its label. */
    plan?: string;
    href: string;
    label?: string;
};

export type UserMenuOptions = {
    /** Which edge of the trigger the popover lines up with. `auto` keeps the left edge unless it would leave the screen. */
    align?: 'start' | 'end' | 'auto';
    items?: UserMenuItem[];
    accountHref?: string | null;
    settingsHref?: string | null;
    subscription?: UserMenuSubscription | null;
    helpHref?: string | null;
    onSignOut?: (() => void) | null;
    showLanguage?: boolean;
    /** The languages the Language rows offer, in this order. Defaults to all four; an empty or invalid list means all four. */
    locales?: Locale[];
    locale?: Locale;
    onLocaleChange?: (locale: Locale) => void;
    showTheme?: boolean;
    theme?: Theme;
    onThemeChange?: (theme: Theme) => void;
    labels?: Partial<UserMenuLabels>;
};

export type UserMenuRow = {
    id: string;
    kind: 'item' | 'radio' | 'submenu' | 'back' | 'gap';
    label: string;
    icon?: string;
    detail?: string;
    href?: string;
    external?: boolean;
    tone?: 'default' | 'danger';
    checked?: boolean;
    run?: () => void;
};

export type UserMenuModel = {
    view: UserMenuView;
    labels: UserMenuLabels;
    options: UserMenuOptions;
    locale: Locale;
    theme: Theme;
    onLocale: (locale: Locale) => void;
    onTheme: (theme: Theme) => void;
};

/** The locales a menu offers: `wanted` without duplicates or unknown values, or all of `LOCALES` when nothing valid is left. */
export function offeredLocales(wanted?: readonly string[] | null): readonly Locale[] {
    const kept = [...new Set((wanted ?? []).filter(isLocale))];
    return kept.length > 0 ? kept : LOCALES;
}

const GAP: UserMenuRow = { id: 'gap', kind: 'gap', label: '' };

function appRows(items: UserMenuItem[] = []): UserMenuRow[] {
    return items.map((item, i) => ({
        id: `item-${i}`,
        kind: 'item',
        label: item.label,
        icon: item.icon,
        href: item.href,
        tone: item.tone,
        run: item.onSelect
    }));
}

function linkRow(id: string, label: string, icon: string, href: string | null | undefined, external = false): UserMenuRow[] {
    return href ? [{ id, kind: 'item', label, icon, href, external }] : [];
}

function subscriptionRow(model: UserMenuModel): UserMenuRow[] {
    const sub = model.options.subscription;
    if (!sub) return [];
    const label = sub.label ?? model.labels.manageSubscription;
    return [{ id: 'subscription', kind: 'item', label, icon: icons.card, href: sub.href, detail: sub.plan || undefined }];
}

function preferenceRows(model: UserMenuModel): UserMenuRow[] {
    const { labels, options } = model;
    const rows: UserMenuRow[] = [];
    if (options.showLanguage !== false) {
        rows.push({ id: 'language', kind: 'submenu', label: labels.language, icon: icons.globe, detail: LOCALE_NAMES[model.locale] });
    }
    if (options.showTheme !== false) {
        rows.push({ id: 'theme', kind: 'submenu', label: labels.theme, icon: icons.palette, detail: labels[model.theme] });
    }
    return rows;
}

function footerRows(model: UserMenuModel): UserMenuRow[] {
    const { labels, options } = model;
    const rows = linkRow('help', labels.help, icons.help, options.helpHref, true);
    if (!options.onSignOut) return rows;
    return [...rows, GAP, { id: 'signOut', kind: 'item', label: labels.signOut, icon: icons.logout, tone: 'danger', run: options.onSignOut }];
}

function rootRows(model: UserMenuModel): UserMenuRow[] {
    const { labels, options } = model;
    return [
        ...linkRow('account', labels.account, icons.userCircle, options.accountHref, true),
        ...appRows(options.items),
        ...linkRow('settings', labels.settings, icons.settings, options.settingsHref),
        ...subscriptionRow(model),
        ...preferenceRows(model),
        ...footerRows(model)
    ];
}

function choiceRows(model: UserMenuModel): UserMenuRow[] {
    const { labels, view } = model;
    const back: UserMenuRow = { id: 'back', kind: 'back', label: labels[view === 'theme' ? 'theme' : 'language'], icon: icons.chevronLeft };
    if (view === 'language') {
        return [back, ...offeredLocales(model.options.locales).map((l): UserMenuRow => ({ id: l, kind: 'radio', label: LOCALE_NAMES[l], checked: l === model.locale, run: () => model.onLocale(l) }))];
    }
    return [back, ...THEMES.map((t): UserMenuRow => ({ id: t, kind: 'radio', label: labels[t], checked: t === model.theme, run: () => model.onTheme(t) }))];
}

/** The rows of one menu view, in the canonical order: Account, app items, Settings, Subscription, Language, Theme, Help, gap, Sign out. */
export function userMenuRows(model: UserMenuModel): UserMenuRow[] {
    return model.view === 'root' ? rootRows(model) : choiceRows(model);
}

/** The rows a keyboard can land on: everything but the spacing gap. */
export function actionable(rows: UserMenuRow[]): UserMenuRow[] {
    return rows.filter((row) => row.kind !== 'gap');
}

/** Where focus starts when a view opens: the checked choice, else the first row. */
export function startIndex(rows: UserMenuRow[]): number {
    return Math.max(0, actionable(rows).findIndex((row) => row.checked));
}

/** The view change a key asks for. Enter and Space on a row are its click, so only the arrows and Escape are keys here. */
export function drillKey(view: UserMenuView, kind: UserMenuRow['kind'] | undefined, key: string): 'enter' | 'leave' | null {
    if (view === 'root') return kind === 'submenu' && key === 'ArrowRight' ? 'enter' : null;
    return key === 'ArrowLeft' || key === 'Escape' ? 'leave' : null;
}

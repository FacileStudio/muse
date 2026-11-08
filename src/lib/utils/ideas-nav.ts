import { getI18n, type I18n } from '../i18n/context.svelte.js';
import { IDEAS_ICON } from './ideas.js';

export type IdeasNavOptions = {
    href: string;
    active?: boolean;
    /** The number of new ideas. 0 shows no badge. */
    count?: number;
    /** True while ideas are being generated or a run is in flight. */
    running?: boolean;
    /** Defaults to the nearest `provideLocale`, which only works while a component initialises. */
    i18n?: I18n;
};

export type IdeasNavItem = {
    label: string;
    href: string;
    icon: string;
    active: boolean;
    badge?: number;
    busy?: boolean;
    hint?: string;
};

/**
 * The Ideas entry for `SideBar` `pages` and `MobileNav` `items`. Every app puts it first.
 * Call it where `i18n` is reachable, or pass `i18n`, and wrap the call in `$derived` for the live badge.
 */
export function ideasNavItem(options: IdeasNavOptions): IdeasNavItem {
    const { href, active = false, count = 0, running = false } = options;
    const { t } = options.i18n ?? getI18n();
    const badge = count > 0 ? count : undefined;
    const hints = [
        badge === undefined ? '' : t('ideas.nav.new', { count: badge }),
        running ? t('ideas.nav.running') : ''
    ].filter(Boolean);
    return {
        label: t('ideas.nav'),
        href,
        icon: IDEAS_ICON,
        active,
        badge,
        busy: running || undefined,
        hint: hints.length > 0 ? hints.join(', ') : undefined
    };
}

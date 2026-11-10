import type { I18n } from '../i18n/context.svelte.js';
import type { UserMenuLabels } from './user-menu.js';

/** The default user menu strings in the active locale. Callers spread their own overrides over it. */
export function userMenuLabels(t: I18n['t']): UserMenuLabels {
    return {
        account: t('userMenu.account'),
        invitations: t('userMenu.invitations'),
        settings: t('userMenu.settings'),
        manageSubscription: t('userMenu.manageSubscription'),
        language: t('userMenu.language'),
        theme: t('userMenu.theme'),
        help: t('userMenu.help'),
        signOut: t('userMenu.signOut'),
        back: t('userMenu.back'),
        system: t('theme.system'),
        light: t('theme.light'),
        dark: t('theme.dark')
    };
}

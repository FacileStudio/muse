import type { I18n } from '../i18n/context.svelte.js';
import { icons } from '../icons.js';
import type { UserMenuInvitations, UserMenuModel, UserMenuRow } from './user-menu.js';

/** The number the avatar dot and the Invitations pill show: the count when above 0, else 0. */
export function pendingInvitations(invitations?: UserMenuInvitations | null): number {
    const count = invitations?.count ?? 0;
    return Number.isFinite(count) && count > 0 ? Math.floor(count) : 0;
}

/** The Invitations row, only while some are pending and an `href` is set. An absolute `href` (Registre) opens a new tab. */
export function invitationsRow(model: UserMenuModel): UserMenuRow[] {
    const invitations = model.options.invitations;
    const count = pendingInvitations(invitations);
    if (!invitations?.href || count === 0) return [];
    return [{
        id: 'invitations',
        kind: 'item',
        label: invitations.label ?? model.labels.invitations,
        icon: icons.mail,
        href: invitations.href,
        external: /^https?:\/\//.test(invitations.href),
        count
    }];
}

/** The trigger's accessible name: the menu, then the pending invitations the avatar dot stands for. */
export function triggerLabel(t: I18n['t'], name: string, pending: number): string {
    const menu = t('userMenu.open', { name });
    return pending > 0 ? `${menu}, ${t('userMenu.invitationsPending', { count: pending })}` : menu;
}

import type { I18n } from '../i18n/context.svelte.js';

/** A peer's identity as the realtime layer hands it over: a socket, user or session id. */
export type PresenceId = string | number;

/** One other person connected to the same document. The caller leaves the viewer out. */
export interface PresencePeer {
    id: PresenceId;
    name: string;
    /** The peer's identity colour, drawn as the ring around the avatar. Any CSS colour. */
    color: string;
    picture?: string;
}

/** Every string `Presence` shows. `{name}` and `{count}` are filled in at render time. */
export interface PresenceLabels {
    region: string;
    follow: string;
    stopFollowing: string;
    following: string;
    stop: string;
    more: string;
}

/** Replaces each `{key}` in `template` with its value; unknown keys stay as written. */
export function fill(template: string, values: Record<string, string | number>): string {
    return template.replace(/\{(\w+)\}/g, (whole, key: string) => (key in values ? String(values[key]) : whole));
}

/** The peer colour when it is a plain CSS colour value, else `currentColor`: it lands in a `style`, so nothing may close the declaration. */
export function safeColor(color: string): string {
    return /^[#\w\s(),.%/+-]+$/.test(color) ? color.trim() : 'currentColor';
}

/** The avatar's ring: a 2px gap in the page background, then 2px of the peer's colour. */
export function halo(color: string): string {
    return `0 0 0 2px var(--color-fc-bg), 0 0 0 4px ${safeColor(color)}`;
}

/** Splits peers into the avatars drawn and the overflow behind the "+N" pill. A `max` below 1 counts as 1. */
export function splitPeers(peers: readonly PresencePeer[], max: number): { shown: PresencePeer[]; hidden: PresencePeer[] } {
    const limit = Math.max(1, Math.floor(max));
    return { shown: peers.slice(0, limit), hidden: peers.slice(limit) };
}

/** The peer being followed, or `undefined` when nobody is or they have left. */
export function followedPeer(peers: readonly PresencePeer[], following: PresenceId | null | undefined): PresencePeer | undefined {
    if (following === null || following === undefined) return undefined;
    return peers.find((peer) => peer.id === following);
}

/** The `Presence` strings in the active locale, with the caller's overrides on top. `more` is already counted. */
export function presenceLabels(t: I18n['t'], count: number, overrides: Partial<PresenceLabels> = {}): PresenceLabels {
    return {
        region: t('presence.region'),
        follow: t('presence.follow'),
        stopFollowing: t('presence.stopFollowing'),
        following: t('presence.following'),
        stop: t('presence.stop'),
        ...overrides,
        more: overrides.more ? fill(overrides.more, { count }) : t('presence.more', { count })
    };
}

/** The tooltip and accessible name of one avatar: the name alone, follow, or stop following. */
export function peerAction(peer: PresencePeer, following: PresenceId | null | undefined, canFollow: boolean, labels: PresenceLabels): string {
    if (!canFollow) return peer.name;
    if (peer.id === following) return labels.stopFollowing;
    return fill(labels.follow, { name: peer.name });
}

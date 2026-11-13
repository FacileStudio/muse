<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import type { PresenceId, PresenceLabels, PresencePeer } from '../../utils/presence.js';

    export type { PresenceId, PresenceLabels, PresencePeer };

    export interface PresenceProps extends HTMLAttributes<HTMLDivElement> {
        /** The other people on the document. Leave the viewer out: the stack shows who else is here. */
        peers: PresencePeer[];
        /** The id of the peer the viewer follows, or `null`. */
        following?: PresenceId | null;
        /** Makes each avatar a button: called with the peer's id to follow them, `null` to stop. */
        onfollow?: (id: PresenceId | null) => void;
        /** Avatars drawn before the rest fold into a "+N" pill. @default 4 */
        max?: number;
        /** Overrides for the strings. `follow` and `following` take `{name}`, `more` takes `{count}`. */
        labels?: Partial<PresenceLabels>;
        class?: string;
    }
</script>

<script lang="ts">
    import { cubicOut } from 'svelte/easing';
    import Avatar from '../atoms/Avatar.svelte';
    import Tooltip from '../atoms/Tooltip.svelte';
    import { getI18n } from '../../i18n/context.svelte.js';
    import { twMerge } from '../../utils/cn.js';
    import { prefersReducedMotion } from '../../utils/motion.js';
    import { fill, followedPeer, halo, peerAction, presenceLabels, safeColor, splitPeers } from '../../utils/presence.js';

    let {
        peers,
        following = null,
        onfollow,
        max = 4,
        labels: overrides,
        class: className = '',
        ...rest
    }: PresenceProps = $props();

    const i18n = getI18n();
    const split = $derived(splitPeers(peers, max));
    const labels = $derived(presenceLabels(i18n.t, split.hidden.length, overrides));
    const followed = $derived(followedPeer(peers, following));
    const overflow = $derived(split.hidden.map((peer) => peer.name).join(', '));

    const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring';
    const slot = `relative inline-flex size-11 shrink-0 items-center justify-center rounded-fc-pill hover:z-10 focus-visible:z-10 ${FOCUS}`;

    function pop(_node: Element) {
        return {
            duration: prefersReducedMotion() ? 0 : 200,
            easing: cubicOut,
            css: (t: number) => `opacity: ${t}; transform: scale(${0.6 + t * 0.4})`
        };
    }

    function toggle(id: PresenceId) {
        onfollow?.(id === following ? null : id);
    }
</script>

<!--
@component
Les autres personnes connectées au même document, en pile d'avatars cerclés de leur couleur, avec « +N » au-delà de `max`. Avec `onfollow`, chaque avatar devient un bouton pour suivre la personne. Rien ne s'affiche quand personne d'autre n'est là.
-->

{#if peers.length > 0}
    <div role="group" aria-label={labels.region} class={twMerge('inline-flex items-center gap-2', className)} {...rest}>
        {#if followed && onfollow}
            <button
                type="button"
                class="inline-flex min-h-11 shrink-0 cursor-pointer items-center rounded-fc-pill {FOCUS}"
                onclick={() => onfollow?.(null)}
            >
                <span class="inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-fc-pill bg-fc-surface px-2.5 text-fc-xs text-fc-fg">
                    <span class="size-2 shrink-0 rounded-fc-pill" style:background-color={safeColor(followed.color)}></span>
                    <span>{fill(labels.following, { name: followed.name })}</span>
                    <span aria-hidden="true" class="text-fc-fg-muted">·</span>
                    <span class="font-semibold">{labels.stop}</span>
                </span>
            </button>
        {/if}

        <ul class="flex items-center">
            {#each split.shown as peer, index (peer.id)}
                {@const action = peerAction(peer, following, Boolean(onfollow), labels)}
                <li class={twMerge('relative flex', index > 0 && '-ms-3.5')} in:pop out:pop>
                    <Tooltip text={action}>
                        {#if onfollow}
                            <button
                                type="button"
                                class="{slot} cursor-pointer"
                                aria-label={action}
                                aria-pressed={peer.id === following}
                                onclick={() => toggle(peer.id)}
                            >
                                <Avatar src={peer.picture} name={peer.name} size="sm" style="box-shadow: {halo(peer.color)}" />
                            </button>
                        {:else}
                            <span class={slot} role="img" aria-label={peer.name}>
                                <Avatar src={peer.picture} name={peer.name} size="sm" aria-hidden="true" style="box-shadow: {halo(peer.color)}" />
                            </span>
                        {/if}
                    </Tooltip>
                </li>
            {/each}
            {#if split.hidden.length > 0}
                <li class="relative flex -ms-3.5" in:pop out:pop>
                    <Tooltip text={overflow}>
                        <span class={slot} role="img" aria-label="{labels.more}: {overflow}">
                            <span
                                class="inline-flex h-8 min-w-8 items-center justify-center whitespace-nowrap rounded-fc-pill bg-fc-surface px-1.5 text-fc-xs font-semibold text-fc-fg"
                                style="box-shadow: 0 0 0 2px var(--color-fc-bg)"
                                aria-hidden="true"
                            >+{split.hidden.length}</span>
                        </span>
                    </Tooltip>
                </li>
            {/if}
        </ul>
    </div>
{/if}

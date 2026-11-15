<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';

    export interface KbdProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
        /** A shortcut such as `mod+k` or `shift+/`. `mod` reads as ⌘ on Apple platforms and Ctrl elsewhere. Each key gets its own cap. */
        keys?: string;
        /** A single key cap. Used when `keys` is not given. */
        children?: Snippet;
        class?: string;
    }
</script>

<script lang="ts">
    import { onMount } from 'svelte';
    import { twMerge } from '../../utils/cn.js';
    import { keyCaps } from '../../utils/shortcut.js';

    let { keys, children, class: className = '', ...rest }: KbdProps = $props();

    let apple = $state(false);

    onMount(() => {
        apple = /Mac|iPhone|iPad/.test(navigator.platform);
    });

    const caps = $derived(keys ? keyCaps(keys, apple) : []);
    const cap =
        'inline-flex min-h-6 min-w-6 items-center justify-center rounded-fc-xs bg-fc-surface px-1.5 font-fc-mono text-fc-xs text-fc-fg-muted';
</script>

<!--
@component
Une touche du clavier, ou un raccourci entier comme `mod+k`, pour dire quel geste déclenche une action. `mod` s'écrit ⌘ sur Apple et Ctrl ailleurs ; chaque touche est une capsule à plat, sans bordure.
-->

{#if caps.length}
    <span class={twMerge('inline-flex items-center gap-1', className)} {...rest}>
        {#each caps as key, i (i)}<kbd class={cap}>{key}</kbd>{/each}
    </span>
{:else}
    <kbd class={twMerge(cap, className)} {...rest}>{@render children?.()}</kbd>
{/if}

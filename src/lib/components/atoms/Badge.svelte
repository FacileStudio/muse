<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import type { Tone } from '../../utils/tone.js';

    export type { Tone };

    export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
        tone?: Tone;
        class?: string;
        children: Snippet;

    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { toneFill } from '../../utils/tone.js';

    let {
        tone = 'neutral',
        class: className = '',
        children,
        ...rest
    }: BadgeProps = $props();

    const classes = $derived(twMerge('inline-flex w-fit max-w-full min-w-0 items-center gap-1 rounded-fc-pill px-2.5 py-0.5 text-fc-xs font-medium whitespace-nowrap', toneFill[tone], className));
</script>

<!--
@component
Une pastille d'état ou de rôle, dimensionnée sur son texte. Huit tons, un seul vocabulaire.
-->

<span class={classes} {...rest}>
    <span class="min-w-0 truncate">{@render children()}</span>
</span>

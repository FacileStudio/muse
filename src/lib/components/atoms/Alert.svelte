<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import type { StatusTone } from '../../utils/tone.js';

    export type Tone = StatusTone;

    export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
        tone?: Tone;
        title?: string;
        class?: string;
        children?: Snippet;

    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { isUrgent } from '../../utils/tone.js';

    let {
        tone = 'info',
        title,
        class: className = '',
        children,
        ...rest
    }: AlertProps = $props();

    const tones: Record<Tone, string> = {
        neutral: 'bg-fc-surface text-fc-fg',
        info: 'bg-fc-info/10 text-fc-info',
        success: 'bg-fc-success/10 text-fc-success',
        warning: 'bg-fc-warning/10 text-fc-warning',
        danger: 'bg-fc-danger/10 text-fc-danger'
    };

    const role = $derived(isUrgent(tone) ? 'alert' : 'status');

    const classes = $derived(twMerge('rounded-fc-md p-3 text-fc-sm', tones[tone], className));
</script>

<!--
@component
Un message qui reste à l'écran. Pour un retour qui passe, c'est un toast.
-->

<div class={classes} {role} {...rest}>
    {#if title}<p class="font-medium mb-1">{title}</p>{/if}
    {#if children}{@render children()}{/if}
</div>

<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';

    export type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

    export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
        tone?: Tone;
        title?: string;
        class?: string;
        children?: Snippet;

    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';

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

    const role = $derived(tone === 'warning' || tone === 'danger' ? 'alert' : 'status');

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

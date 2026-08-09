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

    /*
        Same pairing as `Badge`: the tint carries the tone and the text is the tone itself.
        There is no border. A 10% wash under black body copy states the tone once, weakly,
        and then a `/40` border states it again — two pale outlines saying the same thing,
        which is what made these read as unstyled boxes rather than a status surface.
    */
    const tones: Record<Tone, string> = {
        neutral: 'bg-fc-surface text-fc-fg',
        info: 'bg-fc-info/10 text-fc-info',
        success: 'bg-fc-success/10 text-fc-success',
        warning: 'bg-fc-warning/10 text-fc-warning',
        danger: 'bg-fc-danger/10 text-fc-danger'
    };

    /* `alert` is an assertive live region: it interrupts whatever the screen reader
       is saying. Only earn that for tones the user must act on. */
    const role = $derived(tone === 'warning' || tone === 'danger' ? 'alert' : 'status');

    const classes = $derived(twMerge('rounded-fc-md p-3 text-fc-sm', tones[tone], className));
</script>

<div class={classes} {role} {...rest}>
    {#if title}<p class="font-medium mb-1">{title}</p>{/if}
    {#if children}{@render children()}{/if}
</div>

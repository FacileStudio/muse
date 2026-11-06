<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';

    export type Size = 'sm' | 'md' | 'lg';

    export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
        size?: Size;
        label?: string;
        class?: string;

    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { getI18n } from '../../i18n/context.svelte.js';

    let {
        size = 'md',
        label,
        class: className = '',
        ...rest
    }: SpinnerProps = $props();

    const i18n = getI18n();

    const sizes: Record<Size, string> = {
        sm: 'size-4',
        md: 'size-6',
        lg: 'size-10'
    };

    /*
     * Under reduced motion the spin slows, it does not stop. `motion-reduce:animate-none` froze
     * it into a static ring — a busy indicator that indicates nothing, which is worse than the
     * motion it was avoiding. Vestibular guidance is about large, fast or parallax movement; a
     * 24px ring turning once every three seconds is a legible status, and `Skeleton` and
     * `StatusDot` can keep hiding outright because their absence still reads correctly.
     */
    const classes = $derived(twMerge('inline-block text-fc-fg animate-spin motion-reduce:[animation-duration:3s]', sizes[size], className));
</script>

<!--
@component
Une attente courte. Sous mouvement réduit il ralentit au lieu de se figer — un indicateur d'activité figé n'indique rien.
-->

<span role="status" aria-label={label ?? i18n.t('spinner.loading')} class={classes} {...rest}>
    <svg viewBox="0 0 24 24" class="size-full" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">
        <circle cx="12" cy="12" r="9" class="opacity-20" />
        <path d="M21 12a9 9 0 0 0-9-9" stroke-linecap="round" />
    </svg>
</span>

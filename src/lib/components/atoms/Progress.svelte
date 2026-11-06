<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';

    export type ProgressTone = 'accent' | 'success' | 'warning' | 'danger';

    export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
        /** The current amount, `0` to `max`. `null` is an unknown duration: the bar pulses. */
        value?: number | null;
        max?: number;
        tone?: ProgressTone;
        /** Accessible name. Defaults to the translated "Progress". */
        label?: string;
        class?: string;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { getI18n } from '../../i18n/context.svelte.js';

    let {
        value = null,
        max = 100,
        tone = 'accent',
        label,
        class: className = '',
        ...rest
    }: ProgressProps = $props();

    const i18n = getI18n();

    const tones: Record<ProgressTone, string> = {
        accent: 'bg-fc-accent',
        success: 'bg-fc-success',
        warning: 'bg-fc-warning',
        danger: 'bg-fc-danger'
    };

    const known = $derived(value !== null && value !== undefined);
    const clamped = $derived(known ? Math.min(Math.max(value as number, 0), max) : 0);
    const percent = $derived(max > 0 ? (clamped / max) * 100 : 0);
    const classes = $derived(twMerge('h-2 w-full overflow-hidden rounded-fc-pill bg-fc-surface', className));
</script>

<!--
@component
Une barre de progression. Sans `value` elle pulse : la durée est inconnue. Le remplissage est un aplat, sans bordure, et la valeur reste lisible par `aria-valuenow`.
-->

<div
    role="progressbar"
    aria-label={label ?? i18n.t('progress.label')}
    aria-valuemin={0}
    aria-valuemax={max}
    aria-valuenow={known ? clamped : undefined}
    class={classes}
    {...rest}
>
    <div
        class={twMerge('h-full rounded-fc-pill transition-[width] duration-300 motion-reduce:transition-none', tones[tone], !known && 'w-full animate-pulse')}
        style:width={known ? `${percent}%` : undefined}
    ></div>
</div>

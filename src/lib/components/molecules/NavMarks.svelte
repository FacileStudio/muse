<script module lang="ts">
    export interface NavMarksProps {
        /** The count to show, capped at 99+. 0 or undefined shows no pill. */
        badge?: number;
        /** Shows a pulsing dot for work in progress. */
        busy?: boolean;
        /** Inverts the pill on the active row, where the accent fill is already the background. */
        active?: boolean;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';

    let { badge, busy = false, active = false }: NavMarksProps = $props();

    const shown = $derived(badge && badge > 0 ? (badge > 99 ? '99+' : String(badge)) : '');
</script>

<!--
@component
Les marques d'une ligne de navigation : une pastille de compte et un point d'activité. Elles sont muettes, le libellé de la ligne porte le sens.
-->

{#if busy}
    <span class="size-2 shrink-0 rounded-fc-pill bg-fc-info motion-safe:animate-pulse" aria-hidden="true"></span>
{/if}
{#if shown}
    <span
        class={twMerge(
            'inline-flex min-w-5 shrink-0 items-center justify-center rounded-fc-pill px-1.5 text-fc-xs font-medium whitespace-nowrap',
            active ? 'bg-fc-accent-fg text-fc-accent' : 'bg-fc-accent text-fc-accent-fg'
        )}
    >
        {shown}
    </span>
{/if}

<script module lang="ts">
    import type { IsoDate, Weekday } from '../../utils/calendar.js';

    export interface DateGridProps {
        /** The date the grid's one tab stop sits on. It decides the month shown. Bindable. */
        focused: IsoDate;
        /** The chosen date, or an empty string. */
        value: IsoDate | '';
        min?: IsoDate;
        max?: IsoDate;
        firstDay: Weekday;
        locale: string;
        onPick: (date: IsoDate) => void;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { getI18n } from '../../i18n/context.svelte.js';
    import {
        addMonths,
        clampDate,
        dateForKey,
        formatDate,
        isDisabled,
        monthGrid,
        monthRange,
        monthTitle,
        todayIso,
        weekdayNames
    } from '../../utils/calendar.js';
    import { icons } from '../../icons.js';
    import Icon from '../atoms/Icon.svelte';
    import IconButton from '../atoms/IconButton.svelte';

    let { focused = $bindable(), value, min, max, firstDay, locale, onPick }: DateGridProps = $props();

    const i18n = getI18n();
    const uid = $props.id();
    const titleId = `${uid}-title`;
    let grid: HTMLElement | null = $state(null);

    const bounds = $derived({ min, max });
    const weeks = $derived(monthGrid(focused, firstDay));
    const names = $derived(weekdayNames(locale, firstDay));
    const range = $derived(monthRange(focused));
    const today = todayIso();
    const previousOff = $derived(Boolean(min && range.first <= min));
    const nextOff = $derived(Boolean(max && range.last >= max));

    const within = (day: string) => day >= range.first && day <= range.last;

    function step(months: number) {
        focused = clampDate(addMonths(focused, months), bounds);
    }

    function keydown(event: KeyboardEvent) {
        const next = dateForKey(focused, event.key, event.shiftKey, firstDay, bounds);
        if (next === null) return;
        event.preventDefault();
        focused = next;
        queueMicrotask(() => grid?.querySelector<HTMLElement>('[tabindex="0"]')?.focus());
    }
</script>

<!--
@component
Le calendrier interne de `DatePicker` : l'en-tête de mois et la grille des jours, avec la navigation APG au clavier.
-->

<div class="flex w-full flex-col gap-2">
    <div class="flex items-center justify-between gap-2">
        <IconButton
            variant="ghost"
            aria-label={i18n.t('datePicker.previousMonth')}
            disabled={previousOff}
            onclick={() => step(-1)}
        >
            <Icon icon={icons.chevronLeft} size={18} />
        </IconButton>
        <h2 id={titleId} aria-live="polite" class="text-fc-sm font-semibold capitalize">{monthTitle(focused, locale)}</h2>
        <IconButton
            variant="ghost"
            aria-label={i18n.t('datePicker.nextMonth')}
            disabled={nextOff}
            onclick={() => step(1)}
        >
            <Icon icon={icons.arrow} size={18} />
        </IconButton>
    </div>

    <table bind:this={grid} role="grid" aria-labelledby={titleId} class="w-full border-collapse" onkeydown={keydown}>
        <thead>
            <tr>
                {#each names as name (name.long)}
                    <th scope="col" abbr={name.long} class="size-11 text-center text-fc-xs font-medium text-fc-fg-muted">
                        {name.short}
                    </th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each weeks as week (week[0])}
                <tr>
                    {#each week as day (day)}
                        {@const inMonth = within(day)}
                        {@const off = isDisabled(day, bounds)}
                        <td role="gridcell" aria-selected={inMonth && day === value ? 'true' : undefined} class="p-0 text-center">
                            {#if inMonth}
                                <button
                                    type="button"
                                    tabindex={day === focused ? 0 : -1}
                                    aria-label={formatDate(day, locale)}
                                    aria-current={day === today ? 'date' : undefined}
                                    aria-disabled={off ? 'true' : undefined}
                                    class={twMerge(
                                        'size-11 cursor-pointer rounded-fc-pill text-fc-sm tabular-nums transition-colors hover:bg-fc-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring',
                                        day === today && 'bg-fc-surface font-semibold',
                                        day === value && 'bg-fc-accent font-semibold text-fc-accent-fg hover:bg-fc-accent',
                                        off && 'cursor-not-allowed opacity-40 hover:bg-transparent'
                                    )}
                                    onclick={() => !off && onPick(day)}
                                >
                                    {Number(day.slice(8))}
                                </button>
                            {/if}
                        </td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>

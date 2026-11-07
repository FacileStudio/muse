<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';

    export interface SliderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
        /** The value of a single slider. Bindable. */
        value?: number;
        /** The low and high values of a range slider. Bindable. Used when `range` is set. */
        values?: [number, number];
        range?: boolean;
        min?: number;
        max?: number;
        step?: number;
        disabled?: boolean;
        /** The form field name. A range submits it twice, low then high. */
        name?: string;
        /** Turns a value into the text a screen reader and the thumb read out, such as "75 %". Defaults to the number. */
        valueText?: (value: number) => string;
        class?: string;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { chain } from '../../utils/handlers.js';
    import { getI18n } from '../../i18n/context.svelte.js';
    import { getFieldContext, resolveField } from '../../utils/field.js';
    import { moveThumb, nearestThumb, ratioOf, snap, valueAt, valueForKey, type Thumb } from '../../utils/slider.js';

    let {
        value = $bindable(0),
        values = $bindable<[number, number]>([0, 100]),
        range = false,
        min = 0,
        max = 100,
        step = 1,
        disabled = false,
        name,
        valueText = String,
        id,
        'aria-describedby': describedBy,
        'aria-label': ariaLabel,
        'aria-labelledby': labelledby,
        class: className = '',
        onpointerdown,
        onpointermove,
        onpointerup,
        onpointercancel,
        ...rest
    }: SliderProps = $props();

    const i18n = getI18n();
    const field = getFieldContext();
    const control = $derived(resolveField(field?.(), { id, describedBy }));
    const bounds = $derived({ min, max, step });
    const pair = $derived<[number, number]>([snap(values[0], bounds), snap(values[1], bounds)]);
    const single = $derived(snap(value, bounds));
    const lows = $derived(range ? pair[0] : min);
    const highs = $derived(range ? pair[1] : single);
    const thumbs = $derived<Thumb[]>(range ? [0, 1] : [1]);

    let track: HTMLElement | null = $state(null);
    let dragging: Thumb | null = $state(null);

    function commit(thumb: Thumb, next: number) {
        if (!range) {
            value = next;
            return;
        }
        values = moveThumb(pair, thumb, next);
    }

    function ratioFromPointer(event: PointerEvent): number {
        const box = track?.getBoundingClientRect();
        return box && box.width > 0 ? (event.clientX - box.left) / box.width : 0;
    }

    function press(event: PointerEvent) {
        if (disabled || event.button > 0) return;
        const at = valueAt(ratioFromPointer(event), bounds);
        const thumb: Thumb = range ? nearestThumb(pair, at) : 1;
        dragging = thumb;
        commit(thumb, at);
        (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
        track?.querySelector<HTMLElement>(`[data-thumb="${thumb}"]`)?.focus();
    }

    function drag(event: PointerEvent) {
        if (dragging !== null) commit(dragging, valueAt(ratioFromPointer(event), bounds));
    }

    function release() {
        dragging = null;
    }

    function keydown(event: KeyboardEvent, thumb: Thumb) {
        const current = thumb === 0 ? lows : highs;
        const next = valueForKey(event.key, current, bounds);
        if (next === null || disabled) return;
        event.preventDefault();
        commit(thumb, next);
    }

    const label = (thumb: Thumb) => (range ? i18n.t(thumb === 0 ? 'slider.min' : 'slider.max') : ariaLabel);
    const percent = (n: number) => `${ratioOf(n, bounds) * 100}%`;
</script>

<!--
@component
Un curseur à une valeur ou à deux bornes. Les flèches avancent d'un pas, Pg précédente et suivante d'un dixième, Début et Fin vont aux extrémités ; `valueText` donne le texte lu (« 75 % »). La zone tactile fait 44px de haut, le pouce 24px.
-->

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
    role={range ? 'group' : undefined}
    id={control.id}
    aria-label={range ? ariaLabel : undefined}
    aria-labelledby={range ? (labelledby ?? control.labelId) : undefined}
    class={twMerge('flex h-11 w-full touch-none items-center', disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer', className)}
    {...rest}
    onpointerdown={chain(onpointerdown, press)}
    onpointermove={chain(onpointermove, drag)}
    onpointerup={chain(onpointerup, release)}
    onpointercancel={chain(onpointercancel, release)}
>
    <div bind:this={track} class="relative h-1.5 w-full rounded-fc-pill bg-fc-field">
        <div
            class="absolute inset-y-0 rounded-fc-pill bg-fc-accent"
            style:left={percent(lows)}
            style:right="calc(100% - {percent(highs)})"
        ></div>
        {#each thumbs as thumb (thumb)}
            {@const current = thumb === 0 ? lows : highs}
            <div
                role="slider"
                tabindex={disabled ? -1 : 0}
                data-thumb={thumb}
                aria-valuemin={thumb === 1 && range ? lows : min}
                aria-valuemax={thumb === 0 && range ? highs : max}
                aria-valuenow={current}
                aria-valuetext={valueText(current)}
                aria-orientation="horizontal"
                aria-describedby={control.describedBy}
                aria-disabled={disabled ? 'true' : undefined}
                aria-label={label(thumb)}
                aria-labelledby={range ? undefined : (labelledby ?? control.labelId)}
                class="absolute top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 rounded-fc-full bg-fc-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring"
                style:left={percent(current)}
                onkeydown={(event) => keydown(event, thumb)}
            ></div>
        {/each}
    </div>
    {#if name}
        {#if range}
            <input type="hidden" {name} value={pair[0]} />
            <input type="hidden" {name} value={pair[1]} />
        {:else}
            <input type="hidden" {name} value={single} />
        {/if}
    {/if}
</div>

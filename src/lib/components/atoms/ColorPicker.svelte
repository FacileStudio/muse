<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';

    export interface ColorPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
        value?: string;
        swatches?: readonly string[];
        labels?: Record<string, string>;
        placeholder?: string;
        disabled?: boolean;
        name?: string;
        onChange?: (hex: string) => void;
        class?: string;

    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { controlFill } from '../../utils/control.js';
    import { getI18n } from '../../i18n/context.svelte.js';
    import { parseHex } from '../../colors.js';
    import { getFieldContext } from '../../utils/field.js';

    let {
        value = $bindable(''),
        swatches = [],
        labels,
        placeholder = '#rrggbb',
        disabled = false,
        id,
        name,
        onChange,
        class: className = '',
        ...rest
    }: ColorPickerProps = $props();

    const i18n = getI18n();

    const FALLBACK = '#000000';

    const field = getFieldContext();
    const controlId = $derived(id ?? field?.().id);
    const describes = $derived(field?.().describedBy);
    const isInvalid = $derived(field?.().invalid ? 'true' : undefined);

    let typed = $state<string | null>(null);

    const text = $derived(typed ?? value);
    const selected = $derived(parseHex(value));
    const shown = $derived(selected ?? FALLBACK);

    function commit(hex: string) {
        if (hex === value) return;
        value = hex;
        onChange?.(hex);
    }

    function labelFor(color: string): string {
        return labels?.[color] ?? labels?.[color.toUpperCase()] ?? parseHex(color) ?? color;
    }

    const box =
        controlFill + ' h-11';
</script>

<!--
@component
Le choix d'une couleur quelconque : sélecteur natif et champ hexadécimal. Pour choisir dans une palette fixe, c'est `SwatchPicker`.
-->

<div class={twMerge('flex flex-col gap-2', className)} {...rest}>
    <div class="flex items-center gap-2">
        <!--
            Not `bind:value`: the browser coerces an unparseable value to black and reports it
            back, so a two-way binding here would rewrite the parent's empty string to
            `#000000` on mount — the exact write-back the comment above exists to avoid.
        -->
        <input
            type="color"
            value={shown}
            {disabled}
            aria-label={i18n.t('colorPicker.pick')}
            oninput={(event) => {
                typed = null;
                commit(event.currentTarget.value);
            }}
            class={twMerge(
                box,
                'w-11 shrink-0 cursor-pointer appearance-none p-1 disabled:cursor-not-allowed [&::-moz-color-swatch]:rounded-fc-sm [&::-moz-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-fc-sm [&::-webkit-color-swatch]:border-0'
            )}
        />

        <input
            type="text"
            id={controlId}
            value={text}
            {placeholder}
            {disabled}
            inputmode="text"
            autocomplete="off"
            autocapitalize="off"
            autocorrect="off"
            spellcheck="false"
            aria-describedby={describes}
            aria-invalid={isInvalid}
            oninput={(event) => {
                typed = event.currentTarget.value;
                const parsed = parseHex(typed);
                if (parsed) commit(parsed);
            }}
            onblur={() => (typed = null)}
            class={twMerge(box, 'w-full min-w-0 px-3 font-fc-mono placeholder:font-sans ')}
        />
    </div>

    {#if swatches.length > 0}
        <div class="flex flex-wrap gap-1.5" role="group" aria-label={i18n.t('colorPicker.presets')}>
            {#each swatches as color (color)}
                {@const hex = parseHex(color) ?? color}
                {@const active = selected !== null && hex.toLowerCase() === selected}
                <button
                    type="button"
                    {disabled}
                    aria-pressed={active}
                    aria-label={labelFor(color)}
                    title={labelFor(color)}
                    onclick={() => {
                        typed = null;
                        commit(hex);
                    }}
                    class="group flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-fc-pill focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <span
                        class={twMerge(
                            'h-7 w-7 flex items-center justify-center rounded-fc-pill transition-transform duration-150 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100',
                            active && 'scale-110'
                        )}
                        style:background-color={hex}
                    >
                        {#if active}<svg viewBox="0 0 24 24" aria-hidden="true" class="size-4 text-white mix-blend-difference" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10" /></svg>{/if}
                    </span>
                </button>
            {/each}
        </div>
    {/if}

    {#if name}
        <input type="hidden" {name} value={selected ?? ''} />
    {/if}
</div>

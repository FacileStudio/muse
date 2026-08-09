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

    /*
     * `$bindable('')` and not `$bindable('#000000')`, deliberately.
     *
     * A non-empty default is written *back* into the parent the moment a consumer binds to a
     * key that does not exist yet — `bind:value={record[key]}` on a fresh record. If that
     * record is state something else reads, the write schedules a render, the render recreates
     * the control, and the control writes again; Svelte gives up at the update-depth limit and
     * abandons the flush, freezing the DOM mid-update. `Input` shipped that and it reached
     * production as a permanent spinner over an API call that had already returned 200.
     *
     * So empty means "no colour yet" and nothing is ever written until a person picks one. The
     * OS picker still has to show *something*, and `<input type="color">` has exactly one legal
     * spelling of nothing, which is black — that is the only reason a literal hex appears here.
     */
    const FALLBACK = '#000000';

    const field = getFieldContext();
    const controlId = $derived(id ?? field?.().id);
    const describes = $derived(field?.().describedBy);
    const isInvalid = $derived(field?.().invalid ? 'true' : undefined);

    /*
     * `typed` holds the draft exactly as it was keyed, and it outranks `value` for display.
     * Half a hex is not an error, it is an unfinished one: `#ab` parses to nothing, so nothing
     * is written to the bound value and — crucially — nothing is written back over the two
     * characters the user has so far. The draft is dropped on blur, which is what snaps the
     * field to the canonical `#rrggbb` spelling once the colour is settled.
     */
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
        'h-11 rounded-fc-md border border-fc-border bg-fc-bg text-fc-md text-fc-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring disabled:opacity-50';
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
            aria-label="Pick a colour"
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
            class={twMerge(box, 'w-full min-w-0 px-3 font-fc-mono placeholder:font-sans placeholder:text-fc-fg-muted')}
        />
    </div>

    {#if swatches.length > 0}
        <div class="flex flex-wrap gap-1.5" role="group" aria-label="Colour presets">
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
                            'h-7 w-7 rounded-fc-pill border border-fc-border/60 transition-transform duration-150 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100',
                            active && 'ring-2 ring-fc-ring ring-offset-2 ring-offset-fc-component'
                        )}
                        style:background-color={hex}
                    ></span>
                </button>
            {/each}
        </div>
    {/if}

    {#if name}
        <input type="hidden" {name} value={selected ?? ''} />
    {/if}
</div>

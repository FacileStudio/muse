<script lang="ts">
    import type { HTMLInputAttributes } from 'svelte/elements';
    import { twMerge } from '../../utils/cn.js';

    let {
        label,
        checked = $bindable(false),
        disabled = false,
        class: className = '',
        ...rest
    }: Omit<HTMLInputAttributes, 'type' | 'checked'> & {
        label?: string;
        checked?: boolean;
        disabled?: boolean;
        class?: string;
    } = $props();

    /*
        `relative` is load-bearing, not decoration: `sr-only` is `position: absolute`, and an
        absolutely positioned box whose nearest *positioned* ancestor is the initial containing
        block is laid out against the document — `overflow` on an unpositioned ancestor does not
        clip it. Inside an app shell whose scroller is an inner `<main>`, that puts a 1px input
        at its flow offset in *document* coordinates, several thousand pixels down, and hands
        the page a second scrollbar into empty space. Positioning the label confines it.
    */
    const classes = $derived(twMerge('relative inline-flex items-center gap-3 cursor-pointer text-fc-sm text-fc-fg', disabled ? 'opacity-50 cursor-not-allowed' : '', className));
</script>

<label class={classes}>
    <input type="checkbox" role="switch" bind:checked {disabled} class="peer sr-only" {...rest} />
    <span
        class="relative h-6 w-11 shrink-0 rounded-fc-pill border border-fc-border bg-fc-surface transition-colors peer-checked:border-fc-accent peer-checked:bg-fc-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-fc-ring peer-checked:[&>span]:translate-x-5 peer-checked:[&>span]:bg-fc-accent-fg"
    >
        <span class="absolute top-[3px] left-[3px] h-4 w-4 rounded-fc-pill bg-fc-fg-muted transition-transform"></span>
    </span>
    {#if label}<span>{label}</span>{/if}
</label>

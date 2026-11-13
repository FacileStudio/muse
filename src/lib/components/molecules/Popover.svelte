<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import type { Align } from '../../utils/placement.js';

    export interface PopoverProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
        /** Accessible name of the panel. Also the visible text of the default trigger. */
        label: string;
        /** Whether the panel is open. Bindable. */
        open?: boolean;
        /** Replaces the default trigger's content. The button, its name and its state stay muse's. */
        trigger?: Snippet;
        /** Which edge of the trigger the panel lines up with. `auto` flips when it would leave the screen. */
        align?: Align;
        /** Classes for the panel, which floats outside the wrapper. */
        panelClass?: string;
        onOpenChange?: (open: boolean) => void;
        class?: string;
        children: Snippet;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { floatingPanel, triggerButton } from '../../utils/control.js';
    import { firstFocusable } from '../../utils/focus.js';
    import { AnchoredPopup, present, watchPopup } from '../../utils/popup.svelte.js';
    import { icons } from '../../icons.js';
    import Icon from '../atoms/Icon.svelte';
    import Tooltip from '../atoms/Tooltip.svelte';

    let {
        label,
        open = $bindable(false),
        trigger: triggerContent,
        align = 'auto',
        panelClass = '',
        onOpenChange,
        class: className = '',
        children,
        ...rest
    }: PopoverProps = $props();

    const uid = $props.id();
    const panelId = `${uid}-panel`;
    let triggerEl: HTMLButtonElement | null = $state(null);
    let panelEl: HTMLElement | null = $state(null);

    const geometry = new AnchoredPopup(() => triggerEl, 120, {
        width: () => Math.max(panelEl?.offsetWidth ?? 0, 240),
        align: () => align
    });

    function set(next: boolean) {
        if (next === open) return;
        if (next) geometry.place();
        open = next;
        onOpenChange?.(next);
    }

    function close(refocus: boolean) {
        set(false);
        if (refocus) triggerEl?.focus();
    }

    function keydown(event: KeyboardEvent) {
        if (event.key !== 'Escape' || !open) return;
        event.preventDefault();
        event.stopPropagation();
        close(true);
    }

    function leave(event: FocusEvent) {
        const next = event.relatedTarget as Node | null;
        if (next && !panelEl?.contains(next) && next !== triggerEl) close(false);
    }

    $effect(() => {
        if (!open) return;
        const inside = (node: Node) => Boolean(triggerEl?.contains(node) || panelEl?.contains(node));
        return watchPopup(inside, () => close(false), geometry.place);
    });

    $effect(() => {
        if (open && panelEl) {
            geometry.place();
            (firstFocusable(panelEl) ?? panelEl).focus();
        }
    });
</script>

<!--
@component
Un panneau flottant ouvert par un bouton, pour un formulaire court ou des détails. Non modal : Échap le referme et rend le focus au bouton, un appui ailleurs le referme, et sa bordure n'existe pas, seule l'ombre le détache.
-->

<div class={twMerge('relative inline-block', className)} {...rest}>
    <Tooltip text={label} describe={false} disabled={!triggerContent || open} class="contents">
        <button
            bind:this={triggerEl}
            type="button"
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls={open ? panelId : undefined}
            aria-label={triggerContent ? label : undefined}
            class={triggerButton}
            onclick={() => set(!open)}
            onkeydown={keydown}
        >
            {#if triggerContent}
                {@render triggerContent()}
            {:else}
                <span>{label}</span>
                <Icon icon={icons.chevronDown} size={16} class={twMerge('transition-transform motion-reduce:transition-none', open && 'rotate-180')} />
            {/if}
        </button>
    </Tooltip>

    {#if open}
        <div
            bind:this={panelEl}
            id={panelId}
            popover="manual"
            role="dialog"
            aria-label={label}
            tabindex="-1"
            class={twMerge(floatingPanel, 'max-w-[calc(100vw-1rem)] min-w-60 p-4 text-fc-sm', panelClass)}
            style:left="{geometry.left}px"
            style:top={geometry.up ? 'auto' : `${geometry.top}px`}
            style:bottom={geometry.up ? `${geometry.bottom}px` : 'auto'}
            style:max-height="{geometry.maxHeight}px"
            onkeydown={keydown}
            onfocusout={leave}
            use:present
        >
            {@render children()}
        </div>
    {/if}
</div>

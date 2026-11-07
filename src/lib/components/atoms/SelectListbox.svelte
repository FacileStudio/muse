<script module lang="ts">
    import type { ListModel } from '../../utils/listbox.js';

    export interface SelectListboxProps {
        id: string;
        optionId: (index: number) => string;
        model: ListModel;
        value: string;
        active: number;
        up: boolean;
        left: number;
        top: number;
        bottom: number;
        width: number;
        maxHeight: number;
        label?: string;
        labelledby?: string;
        onpick: (index: number) => void;
        onhover: (index: number) => void;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';

    let {
        id,
        optionId,
        model,
        value,
        active,
        up,
        left,
        top,
        bottom,
        width,
        maxHeight,
        label,
        labelledby,
        onpick,
        onhover
    }: SelectListboxProps = $props();

    function present(node: HTMLElement) {
        if (node.showPopover && !node.matches(':popover-open')) node.showPopover();
    }

    const base = 'flex min-h-11 cursor-pointer items-center gap-2 rounded-fc-sm px-2.5 py-2 text-fc-md text-fc-fg';
</script>

<!--
@component
La liste d'un `Select`, interne : un `listbox` dans la couche supérieure, qui se positionne sous ou au-dessus du bouton.
-->

{#snippet item(index: number)}
    {@const option = model.options[index]}
    {@const chosen = option.value === value}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
        id={optionId(index)}
        role="option"
        tabindex="-1"
        aria-selected={chosen}
        data-active={index === active ? 'true' : undefined}
        aria-disabled={option.disabled ? 'true' : undefined}
        class={twMerge(
            base,
            chosen && 'font-medium',
            index === active && 'bg-fc-accent text-fc-accent-fg',
            option.disabled && 'cursor-not-allowed opacity-50'
        )}
        onclick={() => onpick(index)}
        onpointermove={() => index !== active && !option.disabled && onhover(index)}
    >
        <span class="min-w-0 flex-1 truncate">{option.label}</span>
        <svg
            viewBox="0 0 20 20"
            aria-hidden="true"
            class={twMerge('size-4 shrink-0', !chosen && 'invisible')}
            fill="none"
            stroke="currentColor"
            stroke-width="2.25"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <path d="m4.5 10.5 3.5 3.5 7.5-8" />
        </svg>
    </div>
{/snippet}

<div
    {id}
    popover="manual"
    role="listbox"
    tabindex="-1"
    aria-label={label}
    aria-labelledby={labelledby}
    class="fixed inset-auto m-0 overflow-y-auto overscroll-contain rounded-fc-md bg-fc-bg p-1 text-fc-fg shadow-lg"
    style:left="{left}px"
    style:min-width="min({width}px, calc(100vw - 1rem))"
    style:width="max-content"
    style:max-width="min(calc(100vw - 1rem), calc(100vw - {left}px - 0.5rem))"
    style:top={up ? 'auto' : `${top}px`}
    style:bottom={up ? `${bottom}px` : 'auto'}
    style:max-height="{maxHeight}px"
    onmousedown={(event) => event.preventDefault()}
    use:present
>
    {#each model.groups as group (group.id)}
        {#if group.label}
            <div role="group" aria-labelledby="{id}-{group.id}">
                <div id="{id}-{group.id}" class="px-2.5 pt-2 pb-1 text-fc-xs font-medium text-fc-fg-muted">
                    {group.label}
                </div>
                {#each group.options as option (option.index)}{@render item(option.index)}{/each}
            </div>
        {:else}
            {#each group.options as option (option.index)}{@render item(option.index)}{/each}
        {/if}
    {/each}
</div>

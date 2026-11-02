<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';

    /** With an icon the option shows only the icon and `label` names it; without one the label is the text. */
    export type ToggleItem = { value: string; label: string; icon?: string };

    export interface ToggleGroupProps extends HTMLAttributes<HTMLDivElement> {
        items: ToggleItem[];
        value?: string;
        onChange?: (value: string) => void;
        /** Names the group for screen readers, such as "View". */
        label: string;
        class?: string;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import Icon from '../atoms/Icon.svelte';

    let {
        items,
        value = $bindable(items[0]?.value ?? ''),
        onChange,
        label,
        class: className = '',
        ...rest
    }: ToggleGroupProps = $props();

    function pick(next: string) {
        value = next;
        onChange?.(next);
    }
</script>

<!--
@component
Un choix exclusif posé sur une surface : icônes seules ou libellés courts. L'option choisie prend la marque à 20 %.
-->

<!-- role and label come after `rest`: they are what makes the buttons read as one control.
     The geometry is the Vitrine back office's segmented control: p-1 around p-2 buttons. -->
<div class={twMerge('flex w-fit items-center rounded-fc bg-fc-surface p-1', className)} {...rest} role="group" aria-label={label}>
    {#each items as item (item.value)}
        <button
            type="button"
            title={item.icon ? item.label : undefined}
            aria-label={item.icon ? item.label : undefined}
            aria-pressed={item.value === value}
            onclick={() => pick(item.value)}
            class="flex flex-1 items-center justify-center gap-2 rounded-fc p-2 text-fc-subtext text-fc-muted hover:text-fc-ink aria-pressed:bg-fc-brand/20 aria-pressed:text-fc-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-brand"
        >
            {#if item.icon}
                <Icon icon={item.icon} />
            {:else}
                {item.label}
            {/if}
        </button>
    {/each}
</div>

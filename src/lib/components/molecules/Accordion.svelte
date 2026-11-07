<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';

    export type AccordionItem = { id: string; title: string; disabled?: boolean };

    export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
        items: AccordionItem[];
        /** The ids of the open panels. Bindable. */
        open?: string[];
        /** Lets several panels stay open at once. By default opening one closes the other. */
        multiple?: boolean;
        level?: 2 | 3 | 4 | 5 | 6;
        class?: string;
        /** The content of a panel, given its item. */
        panel: Snippet<[AccordionItem]>;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { headerForKey, toggleOpen } from '../../utils/accordion.js';
    import Collapsible from './Collapsible.svelte';

    let {
        items,
        open = $bindable([]),
        multiple = false,
        level = 3,
        class: className = '',
        panel,
        ...rest
    }: AccordionProps = $props();

    const REGION_LIMIT = 6;

    function keydown(event: KeyboardEvent) {
        const target = event.target as HTMLElement;
        if (!target.matches('[data-collapsible-trigger]')) return;
        const root = event.currentTarget as HTMLElement;
        const triggers = [...root.querySelectorAll<HTMLElement>('[data-collapsible-trigger]')];
        const next = headerForKey(triggers.map((t) => t.hasAttribute('disabled')), triggers.indexOf(target), event.key);
        if (next < 0) return;
        event.preventDefault();
        triggers[next]?.focus();
    }
</script>

<!--
@component
Une pile de panneaux repliables, un seul ouvert à la fois ou plusieurs avec `multiple`. Les flèches haut et bas, Début et Fin passent d'un en-tête à l'autre ; chaque panneau est posé sur un aplat, sans bordure.
-->

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class={twMerge('flex flex-col gap-2', className)} onkeydown={keydown} {...rest}>
    {#each items as item (item.id)}
        <Collapsible
            title={item.title}
            disabled={item.disabled}
            {level}
            region={items.length <= REGION_LIMIT}
            open={open.includes(item.id)}
            onToggle={() => (open = toggleOpen(open, item.id, multiple))}
            class="rounded-fc-lg bg-fc-component"
        >
            {@render panel(item)}
        </Collapsible>
    {/each}
</div>

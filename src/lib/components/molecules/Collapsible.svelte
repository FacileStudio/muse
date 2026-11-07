<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';

    export interface CollapsibleProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'> {
        /** The header text, which is also the button. */
        title: string;
        /** Whether the panel is shown. Bindable. */
        open?: boolean;
        disabled?: boolean;
        /** The heading level that wraps the button, so the page outline stays right. @default 3 */
        level?: 2 | 3 | 4 | 5 | 6;
        /** Whether the panel is a `region` landmark. Turn it off in a long list of panels. @default true */
        region?: boolean;
        onToggle?: (open: boolean) => void;
        class?: string;
        children: Snippet;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { icons } from '../../icons.js';
    import Icon from '../atoms/Icon.svelte';

    let {
        title,
        open = $bindable(false),
        disabled = false,
        level = 3,
        region = true,
        onToggle,
        class: className = '',
        children,
        ...rest
    }: CollapsibleProps = $props();

    const uid = $props.id();
    const buttonId = `${uid}-button`;
    const panelId = `${uid}-panel`;

    function toggle() {
        open = !open;
        onToggle?.(open);
    }
</script>

<!--
@component
Un en-tête qui montre ou cache un panneau. Le bouton porte `aria-expanded` et `aria-controls`, Entrée et Espace le basculent, et le panneau fermé est retiré de l'arbre d'accessibilité.
-->

<div class={className} {...rest}>
    <svelte:element this={`h${level}`} class="m-0 text-fc-sm font-medium">
        <button
            id={buttonId}
            type="button"
            data-collapsible-trigger
            aria-expanded={open}
            aria-controls={panelId}
            {disabled}
            class="flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-fc-md px-3 py-2 text-left text-fc-fg transition-colors hover:bg-fc-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring disabled:cursor-not-allowed disabled:opacity-50"
            onclick={toggle}
        >
            <span class="min-w-0 flex-1">{title}</span>
            <Icon
                icon={icons.chevronDown}
                size={16}
                class={twMerge('text-fc-fg-muted transition-transform motion-reduce:transition-none', open && 'rotate-180')}
            />
        </button>
    </svelte:element>
    <div
        id={panelId}
        role={region ? 'region' : undefined}
        aria-labelledby={region ? buttonId : undefined}
        hidden={!open}
        class="px-3 pt-1 pb-3 text-fc-sm text-fc-fg-muted"
    >
        {@render children()}
    </div>
</div>

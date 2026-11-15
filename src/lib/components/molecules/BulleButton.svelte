<script module lang="ts">
    import type { HTMLButtonAttributes } from 'svelte/elements';
    import type { BulleMood, BulleVariant } from '../../utils/bulle.js';

    export interface BulleButtonProps extends Omit<HTMLButtonAttributes, 'children'> {
        /** The assistant's name. The blob is drawn from it. Defaults to "Bulle". */
        name?: string;
        mood?: BulleMood;
        /** Blob size in px. Defaults to 28 for `header` and `icon`, 20 for `chip`. */
        size?: number;
        /** The visible text beside the blob. Without it the button shows the blob alone. */
        label?: string;
        /** `header` is a button for a page header, `chip` sits inline in a line of text, `icon` is the blob alone. */
        variant?: BulleVariant;
        class?: string;
    }
</script>

<script lang="ts">
    import { getI18n } from '../../i18n/context.svelte.js';
    import { twMerge } from '../../utils/cn.js';
    import { springPress } from '../../utils/press.js';
    import { BULLE_SIZES, bulleAccessibleName, bulleName } from '../../utils/bulle.js';
    import BulleBlob from '../atoms/BulleBlob.svelte';
    import Tooltip from '../atoms/Tooltip.svelte';

    let {
        type = 'button',
        name,
        mood = 'idle',
        size,
        label,
        variant = 'header',
        disabled = false,
        class: className = '',
        ...rest
    }: BulleButtonProps = $props();

    const i18n = getI18n();
    const assistant = $derived(bulleName(name));
    const shown = $derived(variant === 'icon' ? undefined : label?.trim() || undefined);
    const accessibleName = $derived(bulleAccessibleName(rest['aria-label'] ?? undefined, label, i18n.t('bulle.open', { name: assistant })));
    const blobSize = $derived(size ?? BULLE_SIZES[variant]);

    const shapes: Record<BulleVariant, string> = {
        header: 'min-h-11 gap-2 rounded-fc-pill bg-fc-surface px-3 text-fc-sm font-medium text-fc-fg hover:bg-fc-component',
        chip: 'min-h-11 gap-1.5 rounded-fc-pill px-2 text-fc-sm text-fc-fg hover:bg-fc-surface',
        icon: 'size-11 justify-center rounded-fc-pill text-fc-fg hover:bg-fc-surface'
    };

    const classes = $derived(twMerge(
        'inline-flex min-w-11 max-w-full shrink-0 items-center transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring',
        shapes[variant],
        className
    ));
</script>

<!--
@component
Le bouton de l'assistant : le blob de l'utilisateur, tiré de son nom, avec un libellé facultatif et une humeur (au repos, réfléchit, content, indisponible), en version d'en-tête, pastille en ligne ou blob seul.
-->

{#snippet button()}
    <button
        {type}
        {disabled}
        class={classes}
        aria-busy={mood === 'thinking' || undefined}
        data-mood={mood}
        use:springPress
        {...rest}
        aria-label={rest['aria-label'] ?? (shown ? undefined : accessibleName)}
    >
        <BulleBlob name={assistant} {mood} size={blobSize} />
        {#if shown}<span class="min-w-0 truncate">{shown}</span>{/if}
    </button>
{/snippet}

{#if variant === 'icon' && !disabled}
    <Tooltip text={accessibleName} describe={false} class="contents">
        {@render button()}
    </Tooltip>
{:else}
    {@render button()}
{/if}

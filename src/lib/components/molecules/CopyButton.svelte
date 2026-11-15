<script module lang="ts">
    import type { HTMLButtonAttributes } from 'svelte/elements';

    export interface CopyButtonProps extends Omit<HTMLButtonAttributes, 'children' | 'type' | 'onclick' | 'disabled'> {
        disabled?: boolean;
        /** What to copy. A function is called on click, so a value fetched on demand never sits in the page. */
        text: string | (() => string | Promise<string>);
        /** Accessible name and, with `showLabel`, the visible text. Defaults to the translated "Copy". */
        label?: string;
        /** The name after a successful copy. Defaults to the translated "Copied". */
        copiedLabel?: string;
        /** Draws the label next to the icon, in a text button, instead of an icon-only button. */
        showLabel?: boolean;
        variant?: 'ghost' | 'secondary';
        /** Size of the text button. Ignored for the icon-only button. @default 'md' */
        size?: 'sm' | 'md' | 'lg';
        /** Milliseconds the "Copied" state lasts. @default 2000 */
        resetAfter?: number;
        /** Called with the outcome. The caller decides whether a failure deserves a toast. */
        onCopy?: (ok: boolean) => void;
        class?: string;
    }
</script>

<script lang="ts">
    import { getI18n } from '../../i18n/context.svelte.js';
    import { icons } from '../../icons.js';
    import { copyText } from '../../utils/clipboard.js';
    import Button from '../atoms/Button.svelte';
    import Icon from '../atoms/Icon.svelte';
    import IconButton from '../atoms/IconButton.svelte';

    let {
        text,
        label,
        copiedLabel,
        showLabel = false,
        disabled = false,
        variant,
        size = 'md',
        resetAfter = 2000,
        onCopy,
        class: className = '',
        ...rest
    }: CopyButtonProps = $props();

    const i18n = getI18n();

    let copied = $state(false);
    let status = $state('');

    const idle = $derived(label ?? i18n.t('copy.label'));
    const name = $derived(copied ? (copiedLabel ?? i18n.t('copy.copied')) : idle);

    $effect(() => {
        if (!copied) return;
        const timer = setTimeout(() => (copied = false), resetAfter);
        return () => clearTimeout(timer);
    });

    async function copy() {
        let ok = false;
        try {
            ok = await copyText(typeof text === 'function' ? await text() : text);
        } catch {
            ok = false;
        }
        copied = ok;
        status = ok ? (copiedLabel ?? i18n.t('copy.copied')) : i18n.t('copy.failed');
        onCopy?.(ok);
    }
</script>

<!--
@component
Un bouton qui copie un texte dans le presse-papiers, passe en « Copié » un instant et l'annonce aux lecteurs d'écran. Il existe en icône seule ou avec son libellé ; le texte peut être une fonction, pour une valeur qu'on ne va chercher qu'au clic.
-->

{#if showLabel}
    <Button type="button" variant={variant ?? 'secondary'} {size} icon={copied ? icons.check : icons.copy} {disabled} class={className} onclick={copy} {...rest}>
        {name}
    </Button>
{:else}
    <IconButton variant={variant ?? 'ghost'} aria-label={name} {disabled} class={className} onclick={copy} {...rest}>
        <Icon icon={copied ? icons.check : icons.copy} size={18} />
    </IconButton>
{/if}
<span role="status" class="sr-only">{status}</span>

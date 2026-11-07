<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';

    export interface SecretFieldProps extends HTMLAttributes<HTMLDivElement> {
        value?: string;
        label?: string;
        helper?: string;
        error?: string;
        placeholder?: string;
        editable?: boolean;
        sensitive?: boolean;
        copyable?: boolean;
        mask?: 'ends' | 'full';
        visible?: boolean;
        autoHideMs?: number;
        disabled?: boolean;
        for?: string;
        actions?: Snippet;
        onReveal?: (visible: boolean) => void;
        onCopy?: (ok: boolean) => void;
        class?: string;

    }
</script>

<script lang="ts">
    import { getI18n } from '../../i18n/context.svelte.js';
    import Icon from '../atoms/Icon.svelte';
    import { icons } from '../../icons.js';
    import { isRedacted, maskSecret } from '../../utils/secret.js';
    import IconButton from '../atoms/IconButton.svelte';
    import Input from '../atoms/Input.svelte';
    import Field from './Field.svelte';

    let {
        value = $bindable(''),
        label,
        helper,
        error,
        placeholder = '',
        editable = false,
        sensitive = true,
        copyable = true,
        mask = 'ends',
        visible = $bindable(false),
        autoHideMs = 15000,
        disabled = false,
        for: htmlFor,
        actions,
        onReveal,
        onCopy,
        class: className = '',
        ...rest
    }: SecretFieldProps = $props();

    const i18n = getI18n();

    let status = $state('');
    let copyTick = $state(0);

    const copied = $derived(copyTick > 0);
    const empty = $derived(value.length === 0);

    const stored = $derived(isRedacted(value));
    const inert = $derived(disabled || empty || stored);
    const shown = $derived(visible || !sensitive ? value : maskSecret(value, mask));

    function toggle() {
        visible = !visible;
        onReveal?.(visible);
        status = i18n.t(visible ? 'secret.revealed' : 'secret.hidden');
    }

    $effect(() => {
        if (!visible || autoHideMs <= 0) return;
        const timer = setTimeout(() => {
            visible = false;
            status = i18n.t('secret.hiddenAgain');
        }, autoHideMs);
        return () => clearTimeout(timer);
    });

    async function copy() {
        try {
            await navigator.clipboard.writeText(value);
            copyTick += 1;
            status = i18n.t('secret.copied');
            onCopy?.(true);
        } catch {
            status = i18n.t('secret.copyFailed');
            onCopy?.(false);
        }
    }

    $effect(() => {
        if (copyTick === 0) return;
        const timer = setTimeout(() => (copyTick = 0), 2000);
        return () => clearTimeout(timer);
    });

    const box = 'flex h-11 min-w-0 flex-1 items-center rounded-fc-md bg-fc-field px-3 font-fc-mono text-fc-sm';
</script>

<!--
@component
L'affichage d'un secret : masque à longueur fixe, révélation qui se recache, copie avec accusé, et `REDACTED` traité comme une absence de valeur.
-->

<!-- `relative` contains the `sr-only` live region — see the note in `Switch.svelte`. -->
<Field {label} {helper} {error} for={htmlFor} class={className} {...rest}>
    {#snippet children({ id, describedBy })}
        <div class="relative flex items-center gap-2">
            {#if editable}
                <Input
                    bind:value
                    {placeholder}
                    {disabled}
                    type={visible || !sensitive ? 'text' : 'password'}
                    autocomplete="off"
                    autocapitalize="off"
                    autocorrect="off"
                    spellcheck="false"
                    class="min-w-0 flex-1 font-fc-mono text-fc-sm placeholder:font-sans"
                />
            {:else}
                <output
                    {id}
                    aria-describedby={describedBy}
                    class={[box, empty ? 'text-fc-fg-muted' : 'text-fc-fg']}
                    title={visible || !sensitive ? value : undefined}
                >
                    <span class={visible || !sensitive ? 'truncate select-all' : 'truncate select-none'}
                        >{empty ? placeholder || i18n.t('secret.notSet') : shown}</span
                    >
                </output>
            {/if}

            {#if sensitive}
                <IconButton
                    onclick={toggle}
                    disabled={inert}
                    aria-label={i18n.t(visible ? 'secret.hideLabel' : 'secret.revealLabel')}
                    aria-pressed={visible}
                    title={i18n.t(visible ? 'secret.hide' : 'secret.reveal')}
                >
                    <Icon icon={visible ? icons.eyeClosed : icons.eye} size={18} />
                </IconButton>
            {/if}

            {#if copyable}
                <IconButton
                    onclick={copy}
                    disabled={inert}
                    aria-label={i18n.t(sensitive ? 'secret.copySecretLabel' : 'secret.copyLabel')}
                    title={i18n.t('secret.copy')}
                    class={copied ? 'bg-fc-success/10 text-fc-success' : ''}
                >
                    <Icon icon={copied ? icons.check : icons.copy} size={18} />
                </IconButton>
            {/if}

            {#if actions}{@render actions()}{/if}
            <span aria-live="polite" class="sr-only">{status}</span>
        </div>
    {/snippet}
</Field>

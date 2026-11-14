<script module lang="ts">
    export interface CommandLineProps {
        /** The shell command, shown after a `$` prompt and copied as is. */
        command: string;
        /** Names the command in the copy button's label, such as "Homebrew". */
        label: string;
        class?: string;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { getI18n } from '../../i18n/context.svelte.js';
    import { icons } from '../../icons.js';
    import { commandParts } from '../../utils/download.js';
    import Icon from '../atoms/Icon.svelte';
    import IconButton from '../atoms/IconButton.svelte';

    let { command, label, class: className = '' }: CommandLineProps = $props();

    const i18n = getI18n();
    const parts = $derived(commandParts(command));
    let copied = $state(false);
    let status = $state('');

    $effect(() => {
        if (!copied) return;
        const timer = setTimeout(() => (copied = false), 2000);
        return () => clearTimeout(timer);
    });

    async function copy() {
        try {
            await navigator.clipboard.writeText(command);
            copied = true;
            status = i18n.t('download.copied');
        } catch {
            status = i18n.t('download.copyFailed');
        }
    }
</script>

<!--
@component
Une commande de terminal sur fond inversé, avec son bouton copier et l'annonce « Copié ». Une commande longue revient à la ligne entre les mots et les segments de chemin ; `data-command` porte la commande entière. Interne à `DownloadSection` et `ForDevelopers`.
-->

<div
    class={twMerge('relative flex min-w-0 items-start gap-2 rounded-fc-md bg-fc-inverse py-0.5 pr-0.5 pl-3.5', className)}
    data-command={command}
>
    <code class="flex min-w-0 flex-1 gap-2 py-3 font-fc-mono text-fc-sm text-fc-on-inverse">
        <span class="select-none text-fc-on-inverse-muted" aria-hidden="true">$</span>
        <span class="min-w-0">
            {#each parts as word, w (w)}{#if w}{' '}{/if}{#each word as part, p (p)}{#if p}<wbr />{/if}<span
                        class="inline-block max-w-full [overflow-wrap:anywhere]">{part}</span
                    >{/each}{/each}
        </span>
    </code>
    <IconButton
        type="button"
        variant="ghost"
        onclick={copy}
        aria-label={i18n.t('download.copy', { label })}
        class={twMerge(
            'text-fc-on-inverse-muted hover:bg-fc-on-inverse/10 hover:text-fc-on-inverse',
            copied && 'text-fc-on-inverse'
        )}
    >
        <Icon icon={copied ? icons.check : icons.copy} size={18} />
    </IconButton>
    <span aria-live="polite" class="sr-only">{status}</span>
</div>

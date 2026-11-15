<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import type { Tone } from '../../utils/tone.js';
    import type { PendingState } from '../../utils/pending.js';

    export type { PendingState };

    export interface PendingCardProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
        /** What the action is, as the badge reads: "Delete draft", "Send email". */
        kind: string;
        /** Badge tone. Destructive actions are `danger`. @default 'danger' */
        tone?: Tone;
        /** The id of the client that asked, shown as "Asked by Bulle" or the host of a client URL. */
        client: string;
        /** When the client asked. */
        createdAt: Date | string | number;
        /** `ready` shows the confirm button. `changed` and `missing` hide it and say why. @default 'ready' */
        state?: PendingState;
        /** Disables every button while a request is in flight. */
        busy?: boolean;
        confirmLabel: string;
        /** An icon name from `icons`, drawn in the confirm button. */
        confirmIcon?: string;
        /** `danger` for a deletion, `primary` for anything else. @default 'danger' */
        confirmVariant?: 'primary' | 'danger';
        onConfirm: () => void;
        onDismiss: () => void;
        /** Defaults to the translated "Dismiss". */
        dismissLabel?: string;
        /** Replaces the sentence shown when `state` is `changed`. */
        changedLabel?: string;
        /** Replaces the sentence shown when `state` is `missing`. */
        missingLabel?: string;
        /** Extra buttons between Dismiss and Confirm, such as "Open draft". */
        actions?: Snippet;
        /** What the action will do: the thing, its details, a note. */
        children?: Snippet;
        class?: string;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { getI18n } from '../../i18n/context.svelte.js';
    import { pendingClientName } from '../../utils/pending.js';
    import Badge from '../atoms/Badge.svelte';
    import Button from '../atoms/Button.svelte';
    import Card from '../atoms/Card.svelte';

    let {
        kind,
        tone = 'danger',
        client,
        createdAt,
        state = 'ready',
        busy = false,
        confirmLabel,
        confirmIcon,
        confirmVariant = 'danger',
        onConfirm,
        onDismiss,
        dismissLabel,
        changedLabel,
        missingLabel,
        actions,
        children,
        class: className = '',
        ...rest
    }: PendingCardProps = $props();

    const i18n = getI18n();

    const when = $derived(
        new Intl.DateTimeFormat(i18n.locale, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(createdAt))
    );
    const warning = $derived(
        state === 'changed' ? (changedLabel ?? i18n.t('pending.changed')) : state === 'missing' ? (missingLabel ?? i18n.t('pending.missing')) : ''
    );
    const touch = 'w-full sm:w-auto';
</script>

<!--
@component
La carte d'une action en attente qu'un client IA a demandée : le type en badge, qui l'a demandée et quand, le détail de ce qui va se passer, puis Ignorer et Confirmer. Si l'objet a changé ou a disparu depuis la demande, la carte le dit et retire Confirmer.
-->

<Card class={twMerge('flex flex-col gap-4', className)} {...rest}>
    <div class="flex flex-wrap items-center justify-between gap-2">
        <Badge {tone} class="shrink-0 whitespace-nowrap">{kind}</Badge>
        <span class="text-fc-xs text-fc-fg-muted">{i18n.t('pending.askedBy', { client: pendingClientName(client) })} · {when}</span>
    </div>

    {#if children}{@render children()}{/if}

    {#if warning}
        <p class="text-fc-sm text-fc-warning" role="status">{warning}</p>
    {/if}

    <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="ghost" class={touch} disabled={busy} onclick={onDismiss}>{dismissLabel ?? i18n.t('pending.dismiss')}</Button>
        {#if actions}{@render actions()}{/if}
        {#if state === 'ready'}
            <Button variant={confirmVariant} class={touch} disabled={busy} icon={confirmIcon} onclick={onConfirm}>{confirmLabel}</Button>
        {/if}
    </div>
</Card>

<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import type { BulleMood } from '../../utils/bulle.js';

    export interface BullePanelProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'title'> {
        /** The assistant's name. The blob is drawn from it. Defaults to "Bulle". */
        name?: string;
        /** The heading. Defaults to the assistant's name. */
        title?: string;
        /** Overrides the mood the panel derives: `thinking` while `busy`, `unavailable` on `error`, else `idle`. */
        mood?: BulleMood;
        /** A request is running. Shows a live status line and marks the body busy. */
        busy?: boolean;
        /** What went wrong, in words. Shows an alert above the body. */
        error?: string | null;
        /** Adds a "Try again" button to the error. */
        onRetry?: () => void;
        /** The account has no AI plan. Shows a short upsell in place of the body. An unsafe address hides its button. */
        upgradeHref?: string;
        /** The upsell line. Defaults to a generic "needs a paid plan" sentence naming the assistant. */
        upsellText?: string;
        /** Replaces the built-in upsell. Shown when `upgradeHref` is set. */
        upsell?: Snippet;
        /** Controls on the right of the title row, such as a close button. */
        actions?: Snippet;
        children?: Snippet;
        class?: string;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { getI18n } from '../../i18n/context.svelte.js';
    import { isSafeHref } from '../../utils/href.js';
    import { bulleName } from '../../utils/bulle.js';
    import Alert from '../atoms/Alert.svelte';
    import Button from '../atoms/Button.svelte';
    import Spinner from '../atoms/Spinner.svelte';
    import BulleBlob from '../atoms/BulleBlob.svelte';

    let {
        name,
        title,
        mood,
        busy = false,
        error = null,
        onRetry,
        upgradeHref,
        upsellText,
        upsell,
        actions,
        children,
        class: className = '',
        ...rest
    }: BullePanelProps = $props();

    const i18n = getI18n();
    const assistant = $derived(bulleName(name));
    const heading = $derived(title?.trim() || assistant);
    const shownMood = $derived<BulleMood>(mood ?? (error ? 'unavailable' : busy ? 'thinking' : 'idle'));
    const gated = $derived(upgradeHref !== undefined);
</script>

<!--
@component
La coquille d'un panneau d'assistant : une ligne de titre avec le blob et le nom, un corps libre, les états occupé et erreur, et une invite courte vers les forfaits quand le compte n'a pas l'IA.
-->

<section
    aria-label={i18n.t('bulle.panel', { name: heading })}
    aria-busy={busy || undefined}
    class={twMerge('flex min-w-0 flex-col gap-4 rounded-fc-md bg-fc-component p-5', className)}
    {...rest}
>
    <header class="flex min-w-0 items-center gap-3">
        <BulleBlob name={assistant} mood={shownMood} size={36} />
        <h2 class="m-0 min-w-0 flex-1 truncate text-fc-lg font-medium text-fc-fg">{heading}</h2>
        {#if actions}{@render actions()}{/if}
    </header>

    {#if busy && !gated}
        <p class="m-0 flex items-center gap-2 text-fc-sm text-fc-fg-muted" role="status">
            <Spinner size="sm" />
            <span class="min-w-0 wrap-anywhere">{i18n.t('bulle.busy', { name: assistant })}</span>
        </p>
    {/if}

    {#if error && !gated}
        <Alert tone="danger" class="flex flex-col items-start gap-3">
            <span class="wrap-anywhere">{error}</span>
            {#if onRetry}
                <Button variant="secondary" size="sm" onclick={onRetry}>{i18n.t('bulle.retry')}</Button>
            {/if}
        </Alert>
    {/if}

    {#if gated}
        {#if upsell}
            {@render upsell()}
        {:else}
            <p class="m-0 text-fc-sm wrap-anywhere text-fc-fg-muted">
                {upsellText?.trim() || i18n.t('bulle.upsell', { name: assistant })}
            </p>
            {#if isSafeHref(upgradeHref ?? '')}
                <Button href={upgradeHref} size="lg" class="self-start">{i18n.t('bulle.upgrade')}</Button>
            {/if}
        {/if}
    {:else if children}
        <div class="min-w-0">{@render children()}</div>
    {/if}
</section>

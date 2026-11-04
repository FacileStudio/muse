<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import type { PlanLimitError } from '../../utils/plan-limit.js';

    export type PlanLimitVariant = 'banner' | 'dialog';

    export interface PlanLimitProps extends HTMLAttributes<HTMLDivElement> {
        /** The 402 body, read with `planLimitFrom`. `null` renders nothing. */
        error: PlanLimitError | null;
        /** `banner` sits in the page; `dialog` answers the action that hit the limit. */
        variant?: PlanLimitVariant;
        /** Dialog only. Opens again each time `error` changes to a new value. */
        open?: boolean;
        onClose?: () => void;
        class?: string;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { getI18n } from '../../i18n/context.svelte.js';
    import { isSafeUpgradeUrl } from '../../utils/plan-limit.js';
    import Button from '../atoms/Button.svelte';
    import Modal from '../organisms/Modal.svelte';

    let {
        error,
        variant = 'banner',
        open = $bindable(true),
        onClose,
        class: className = '',
        ...rest
    }: PlanLimitProps = $props();

    const i18n = getI18n();
    const upgrade = $derived(isSafeUpgradeUrl(error?.upgrade_url) ? error?.upgrade_url : undefined);
    const limit = $derived(
        error?.limit === undefined ? undefined : i18n.t('planLimit.limit', { limit: error.limit })
    );

    $effect(() => {
        if (error) open = true;
    });

</script>

<!--
@component
La limite d'offre atteinte, lue depuis une réponse 402 : un bandeau dans la page ou une fenêtre qu'on ferme, jamais un mur devant le contenu.
-->

{#snippet body()}
    {#if error?.message}<p>{error.message}</p>{/if}
    {#if limit}<p class="text-fc-fg-muted">{limit}</p>{/if}
{/snippet}

{#if error && variant === 'banner'}
    <div
        role="status"
        data-limit-key={error.key}
        class={twMerge(
            'flex flex-wrap items-center justify-between gap-3 rounded-fc-md bg-fc-warning/10 p-3 text-fc-sm text-fc-fg',
            className
        )}
        {...rest}
    >
        <div class="flex min-w-48 flex-1 flex-col gap-1">
            <p class="font-semibold text-fc-warning">{i18n.t('planLimit.title')}</p>
            {@render body()}
        </div>
        {#if upgrade}
            <Button href={upgrade} rel="external" size="sm">
                {i18n.t('planLimit.cta')}
            </Button>
        {/if}
    </div>
{:else if error}
    <Modal bind:open title={i18n.t('planLimit.title')} size="sm" showClose {onClose} class={className}>
        <div class="flex flex-col gap-2 text-fc-sm text-fc-fg" data-limit-key={error.key}>
            {@render body()}
        </div>
        {#snippet footer()}
            <Button variant="ghost" onclick={() => (open = false)}>{i18n.t('planLimit.dismiss')}</Button>
            {#if upgrade}
                <Button href={upgrade} rel="external">{i18n.t('planLimit.cta')}</Button>
            {/if}
        {/snippet}
    </Modal>
{/if}

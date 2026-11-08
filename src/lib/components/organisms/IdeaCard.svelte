<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import type { ApprovalRequest, Idea } from '../../utils/ideas.js';

    export interface IdeaCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
        idea: Idea;
        /** True while a request for this idea is in flight. Every action stays disabled. */
        busy?: boolean;
        /** Heading level of the title, so the card fits the page outline. @default 2 */
        level?: 2 | 3 | 4;
        onRun?: (idea: Idea) => void;
        onDismiss?: (idea: Idea) => void;
        onApprove?: (idea: Idea, approval: ApprovalRequest) => void;
        onDecline?: (idea: Idea, approval: ApprovalRequest) => void;
        class?: string;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { getI18n } from '../../i18n/context.svelte.js';
    import { icons } from '../../icons.js';
    import { ideaActions, ideaKind, ideaRunState, runTone } from '../../utils/ideas.js';
    import { runLabel } from '../../utils/ideas-view.js';
    import { isSafeHref } from '../../utils/href.js';
    import Alert from '../atoms/Alert.svelte';
    import Badge from '../atoms/Badge.svelte';
    import Button from '../atoms/Button.svelte';
    import Card from '../atoms/Card.svelte';
    import Icon from '../atoms/Icon.svelte';
    import Spinner from '../atoms/Spinner.svelte';
    import ApprovalCard from '../molecules/ApprovalCard.svelte';
    import Collapsible from '../molecules/Collapsible.svelte';
    import IdeaLinks from '../molecules/IdeaLinks.svelte';

    let {
        idea,
        busy = false,
        level = 2,
        onRun,
        onDismiss,
        onApprove,
        onDecline,
        class: className = '',
        ...rest
    }: IdeaCardProps = $props();

    const i18n = getI18n();
    const kind = $derived(ideaKind(idea, i18n.t));
    const state = $derived(ideaRunState(idea));
    const tone = $derived(runTone(state));
    const actions = $derived(ideaActions(state));
    const run = $derived(idea.run);
    const outputs = $derived((run?.outputs ?? []).filter((output) => isSafeHref(output.href)));
    const showContinue = $derived(state !== 'idle' && isSafeHref(idea.continueHref));
</script>

<!--
@component
Une idée proposée par l'assistant : type, titre, raison, sources, brouillon replié, puis lancer ou écarter. Le run se lit dans la carte : en cours, accord à donner, résultat avec ses liens, ou échec.
-->

<Card class={twMerge('flex h-full flex-col gap-4', className)} {...rest}>
    <div class="flex items-start gap-3">
        <span
            class="flex size-9 shrink-0 items-center justify-center rounded-fc-pill bg-fc-surface text-fc-fg-muted"
            aria-hidden="true"
        >
            <Icon icon={kind.icon} size={18} />
        </span>
        <div class="flex min-w-0 flex-1 flex-col gap-1.5">
            <div class="flex flex-wrap items-center gap-1.5">
                <Badge tone="neutral">{kind.label}</Badge>
                {#if tone}
                    <Badge {tone}>{runLabel(state, i18n.t)}</Badge>
                {/if}
            </div>
            <svelte:element this={`h${level}`} class="m-0 text-fc-base font-medium wrap-anywhere text-fc-fg">
                {idea.title}
            </svelte:element>
            <p class="text-fc-sm wrap-anywhere text-fc-fg-muted">{idea.why}</p>
        </div>
    </div>

    {#if idea.sources?.length}
        <IdeaLinks sources={idea.sources} label={i18n.t('ideas.card.sources')} />
    {/if}

    {#if idea.draft}
        <Collapsible title={i18n.t('ideas.card.draft')} level={4} region={false} class="-mx-3">
            <p class="rounded-fc-md bg-fc-surface p-3 text-fc-sm whitespace-pre-wrap wrap-anywhere text-fc-fg">
                {idea.draft}
            </p>
        </Collapsible>
    {/if}

    <div class="flex flex-col gap-3" aria-live="polite">
        {#if state === 'running'}
            <p class="flex items-center gap-2 text-fc-sm text-fc-fg-muted">
                <Spinner size="sm" label={i18n.t('ideas.state.running')} />
                {i18n.t('ideas.state.running')}
            </p>
        {:else if state === 'needs_approval' && run?.approval}
            <ApprovalCard
                approval={run.approval}
                {busy}
                onApprove={(approval) => onApprove?.(idea, approval)}
                onDecline={(approval) => onDecline?.(idea, approval)}
            />
        {:else if state === 'done'}
            {#if run?.summary}
                <p class="text-fc-sm wrap-anywhere text-fc-fg">{run.summary}</p>
            {/if}
            {#if outputs.length}
                <ul class="flex flex-wrap gap-2" aria-label={i18n.t('ideas.card.outputs')}>
                    {#each outputs as output (output.href)}
                        <li class="max-w-full">
                            <Button href={output.href} variant="secondary" iconRight={icons.external}>{output.label}</Button>
                        </li>
                    {/each}
                </ul>
            {/if}
        {:else if state === 'failed'}
            <Alert tone="danger">{run?.error || i18n.t('ideas.card.failed')}</Alert>
        {/if}
    </div>

    <div class="mt-auto flex flex-wrap items-center gap-2">
        {#if actions.run}
            <Button size="lg" icon={icons.bolt} disabled={busy} aria-busy={busy} onclick={() => onRun?.(idea)}>
                {i18n.t('ideas.card.run')}
            </Button>
        {/if}
        {#if actions.retry}
            <Button size="lg" icon={icons.refresh} disabled={busy} aria-busy={busy} onclick={() => onRun?.(idea)}>
                {i18n.t('ideas.card.retry')}
            </Button>
        {/if}
        {#if showContinue}
            <Button href={idea.continueHref} size="lg" variant="ghost" iconRight={icons.external}>
                {i18n.t('ideas.card.continue')}
            </Button>
        {/if}
        {#if actions.dismiss && !(actions.approve && run?.approval)}
            <Button size="lg" variant="ghost-danger" class="px-4" icon={icons.close} disabled={busy} onclick={() => onDismiss?.(idea)}>
                {i18n.t('ideas.card.dismiss')}
            </Button>
        {/if}
    </div>
</Card>

<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import type { ApprovalRequest, Idea } from '../../utils/ideas.js';

    export type IdeasLayout = 'grid' | 'list';

    export interface IdeasPageProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
        ideas: Idea[];
        /** True on the first load, before any idea is known. */
        loading?: boolean;
        /** True while a batch is being generated. The button waits and an empty page says so. */
        generating?: boolean;
        /** The load or generate error. With ideas on screen it shows as an alert above them. */
        error?: string | null;
        /** When the last batch finished: an ISO string, a timestamp or a Date. */
        lastGeneratedAt?: string | number | Date | null;
        /** Ids of the ideas with a request in flight. */
        busyIds?: string[];
        /** Grid or list. Bindable. The switch shows from the md breakpoint, as a phone has one column. */
        layout?: IdeasLayout;
        title?: string;
        description?: string;
        /** Extra header actions, next to the Generate button. */
        extraActions?: Snippet;
        onGenerate: () => void;
        /** Retries after a load error. Defaults to `onGenerate`. */
        onRetry?: () => void;
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
    import { IDEAS_ICON } from '../../utils/ideas.js';
    import { ideasView, relativeTime } from '../../utils/ideas-view.js';
    import Alert from '../atoms/Alert.svelte';
    import Button from '../atoms/Button.svelte';
    import Icon from '../atoms/Icon.svelte';
    import IconButton from '../atoms/IconButton.svelte';
    import Spinner from '../atoms/Spinner.svelte';
    import EmptyState from '../molecules/EmptyState.svelte';
    import PageHeader from '../layout/PageHeader.svelte';
    import IdeaCard from './IdeaCard.svelte';

    let {
        ideas,
        loading = false,
        generating = false,
        error = null,
        lastGeneratedAt = null,
        busyIds = [],
        layout = $bindable('grid'),
        title,
        description,
        extraActions,
        onGenerate,
        onRetry,
        onRun,
        onDismiss,
        onApprove,
        onDecline,
        class: className = '',
        ...rest
    }: IdeasPageProps = $props();

    const i18n = getI18n();
    const view = $derived(ideasView({ ideas, loading, generating, error }));
    const last = $derived(
        lastGeneratedAt === null || lastGeneratedAt === undefined
            ? i18n.t('ideas.neverGenerated')
            : i18n.t('ideas.lastGenerated', { time: relativeTime(lastGeneratedAt, i18n.locale) })
    );
    const layouts: { id: IdeasLayout; icon: string }[] = [
        { id: 'grid', icon: icons.widget },
        { id: 'list', icon: icons.menu }
    ];
    const listClass = $derived(layout === 'grid' ? 'grid gap-4 md:grid-cols-2 xl:grid-cols-3' : 'flex flex-col gap-4');
</script>

<!--
@component
La page des idées : en-tête avec Générer et l'heure de la dernière génération, puis une grille ou une liste de cartes, ou l'état vide, occupé, en erreur ou en chargement. Elle ne charge rien : l'app passe les données et les callbacks.
-->

<div class={twMerge('flex flex-col gap-6', className)} {...rest}>
    <div class="flex flex-col gap-2">
        <PageHeader title={title ?? i18n.t('ideas.title')} description={description ?? i18n.t('ideas.description')}>
            {#snippet actions()}
                {#if view === 'list'}
                    <div role="group" aria-label={i18n.t('ideas.layout')} class="hidden items-center gap-1 md:flex">
                        {#each layouts as option (option.id)}
                            <IconButton
                                variant={layout === option.id ? 'secondary' : 'ghost'}
                                aria-label={i18n.t(`ideas.layout.${option.id}`)}
                                aria-pressed={layout === option.id}
                                onclick={() => (layout = option.id)}
                            >
                                <Icon icon={option.icon} size={18} />
                            </IconButton>
                        {/each}
                    </div>
                {/if}
                {#if extraActions}{@render extraActions()}{/if}
                <Button size="lg" icon={generating ? undefined : IDEAS_ICON} disabled={generating} aria-busy={generating} onclick={onGenerate}>
                    {#if generating}
                        <Spinner size="sm" class="text-current" aria-hidden="true" />
                        {i18n.t('ideas.generating')}
                    {:else}
                        {i18n.t('ideas.generate')}
                    {/if}
                </Button>
            {/snippet}
        </PageHeader>
        <p class="text-fc-xs text-fc-fg-muted">{last}</p>
    </div>

    <p class="sr-only" role="status">{generating ? i18n.t('ideas.generating') : ''}</p>

    {#if view === 'loading'}
        <div class="flex min-h-[30vh] items-center justify-center">
            <Spinner label={i18n.t('ideas.loading')} />
        </div>
    {:else if view === 'error'}
        <EmptyState icon={icons.warning} title={i18n.t('ideas.error.title')} description={error ?? undefined}>
            <Button size="lg" icon={icons.refresh} onclick={onRetry ?? onGenerate}>{i18n.t('ideas.error.retry')}</Button>
        </EmptyState>
    {:else if view === 'busy'}
        <EmptyState icon={IDEAS_ICON} title={i18n.t('ideas.busy.title')} description={i18n.t('ideas.busy.description')}>
            <Spinner aria-hidden="true" />
        </EmptyState>
    {:else if view === 'empty'}
        <EmptyState icon={IDEAS_ICON} title={i18n.t('ideas.empty.title')} description={i18n.t('ideas.empty.description')}>
            <Button size="lg" icon={IDEAS_ICON} onclick={onGenerate}>{i18n.t('ideas.generate')}</Button>
        </EmptyState>
    {:else}
        {#if error}
            <Alert tone="danger">{error}</Alert>
        {/if}
        <ul class={listClass} aria-label={i18n.t('ideas.list')}>
            {#each ideas as idea (idea.id)}
                <li class="min-w-0">
                    <IdeaCard {idea} busy={busyIds.includes(idea.id)} {onRun} {onDismiss} {onApprove} {onDecline} />
                </li>
            {/each}
        </ul>
    {/if}
</div>

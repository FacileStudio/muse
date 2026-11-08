<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import type { Idea } from '../../utils/ideas.js';

    export type IdeaExample = Pick<Idea, 'kind' | 'title' | 'why' | 'icon' | 'kindLabel'>;

    export interface IdeasUpsellProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
        /** Where the plans are. An unsafe address hides the button. */
        upgradeHref: string;
        /** Three examples of ideas. Defaults to the built-in set in the active locale. */
        examples?: IdeaExample[];
        class?: string;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { getI18n } from '../../i18n/context.svelte.js';
    import { isSafeHref } from '../../utils/href.js';
    import { IDEAS_ICON, ideaKind } from '../../utils/ideas.js';
    import Badge from '../atoms/Badge.svelte';
    import Button from '../atoms/Button.svelte';
    import Card from '../atoms/Card.svelte';
    import Icon from '../atoms/Icon.svelte';
    import PageHeader from '../layout/PageHeader.svelte';

    let { upgradeHref, examples, class: className = '', ...rest }: IdeasUpsellProps = $props();

    const i18n = getI18n();
    const samples = $derived<IdeaExample[]>(
        examples ??
            (['mail', 'task', 'follow_up'] as const).map((kind) => ({
                kind,
                title: i18n.t(`ideas.upsell.${kind}.title`),
                why: i18n.t(`ideas.upsell.${kind}.why`)
            }))
    );
</script>

<!--
@component
La page des idées pour un forfait sans IA : elle explique ce que l'assistant proposerait avec trois exemples, puis renvoie vers les forfaits.
-->

<div class={twMerge('flex flex-col gap-6', className)} {...rest}>
    <PageHeader title={i18n.t('ideas.title')} description={i18n.t('ideas.upsell.title')} />

    <Card class="flex flex-col items-start gap-4">
        <Icon icon={IDEAS_ICON} size={24} class="text-fc-fg-muted" />
        <p class="max-w-prose text-fc-sm text-fc-fg-muted">{i18n.t('ideas.upsell.description')}</p>
        {#if isSafeHref(upgradeHref)}
            <Button href={upgradeHref} size="lg">{i18n.t('ideas.upsell.cta')}</Button>
        {/if}
    </Card>

    <ul class="grid gap-4 md:grid-cols-3" aria-label={i18n.t('ideas.upsell.examples')}>
        {#each samples as sample, index (index)}
            {@const kind = ideaKind(sample, i18n.t)}
            <li class="min-w-0">
                <Card class="flex h-full flex-col gap-3 bg-fc-surface">
                    <div class="flex flex-wrap items-center gap-1.5">
                        <span class="flex size-8 shrink-0 items-center justify-center rounded-fc-pill bg-fc-component text-fc-fg-muted" aria-hidden="true">
                            <Icon icon={kind.icon} size={16} />
                        </span>
                        <Badge tone="neutral">{i18n.t('ideas.upsell.example')}</Badge>
                    </div>
                    <h2 class="m-0 text-fc-base font-medium wrap-anywhere text-fc-fg">{sample.title}</h2>
                    <p class="text-fc-sm wrap-anywhere text-fc-fg-muted">{sample.why}</p>
                </Card>
            </li>
        {/each}
    </ul>
</div>

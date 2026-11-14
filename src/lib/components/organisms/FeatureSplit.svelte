<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import type { FeatureItem } from '../../utils/landing-blocks.js';

    export type { FeatureItem };

    export interface FeatureSplitProps extends HTMLAttributes<HTMLElement> {
        title: string;
        /** One line under the heading. */
        description?: string;
        /** Four to six features: an icon, a short title, one line. */
        features: FeatureItem[];
        /** Puts the list on the left and the heading on the right from 1024px, to alternate with the section above. */
        reverse?: boolean;
        /** The section heading level; features take the next one. @default 2 */
        headingLevel?: 2 | 3;
        /** Classes merged onto the section heading, to match the host page's own headings. */
        headingClass?: string;
        class?: string;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { LANDING_HEADING } from '../../utils/landing-blocks.js';
    import Icon from '../atoms/Icon.svelte';

    let {
        title,
        description,
        features,
        reverse = false,
        headingLevel = 2,
        headingClass = '',
        class: className = '',
        ...rest
    }: FeatureSplitProps = $props();

    const uid = $props.id();
    const heading = $derived(`h${headingLevel}` as 'h2' | 'h3');
    const itemHeading = $derived(headingLevel === 2 ? 'h3' : 'h4');
</script>

<!--
@component
Une section de fonctions en deux colonnes : le titre et une phrase d'un côté, la liste des fonctions avec leur icône de l'autre. Les colonnes suivent la largeur de la section, pas celle de l'écran : elles s'empilent sous 896px.
-->

<section
    aria-labelledby="{uid}-title"
    class={twMerge('@container min-w-0', className)}
    {...rest}
>
    <div class="grid min-w-0 gap-10 @4xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] @4xl:gap-16">
        <div class={twMerge('flex min-w-0 flex-col gap-3', reverse && '@4xl:order-last')}>
            <svelte:element this={heading} id="{uid}-title" class={twMerge(LANDING_HEADING, headingClass)}>{title}</svelte:element>
            {#if description}<p class="text-fc-md text-fc-fg-muted">{description}</p>{/if}
        </div>
        <ul class="grid min-w-0 gap-x-10 gap-y-8 @xl:grid-cols-2">
            {#each features as feature (feature.title)}
                <li class="flex min-w-0 gap-4">
                    <span class="flex size-10 shrink-0 items-center justify-center rounded-fc-md bg-fc-surface text-fc-fg">
                        <Icon icon={feature.icon} size={20} />
                    </span>
                    <div class="flex min-w-0 flex-col gap-1">
                        <svelte:element this={itemHeading} class="text-fc-md font-semibold text-fc-fg">{feature.title}</svelte:element>
                        {#if feature.text}<p class="text-fc-sm text-fc-fg-muted">{feature.text}</p>{/if}
                    </div>
                </li>
            {/each}
        </ul>
    </div>
</section>

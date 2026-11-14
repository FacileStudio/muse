<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import type { WorksWithApp } from '../../utils/landing-blocks.js';

    export type { WorksWithApp };

    export interface WorksWithProps extends HTMLAttributes<HTMLElement> {
        /** The suite apps this one really connects to, each with what the two do together. */
        apps: WorksWithApp[];
        /** Overrides the "Works with the rest of the suite" heading. */
        title?: string;
        /** One line under the heading. */
        description?: string;
        /** @default 2 */
        headingLevel?: 2 | 3;
        /** Classes merged onto the section heading, to match the host page's own headings. */
        headingClass?: string;
        class?: string;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { getI18n } from '../../i18n/context.svelte.js';
    import { LANDING_HEADING, worksWithApps } from '../../utils/landing-blocks.js';
    import { icons } from '../../icons.js';
    import Icon from '../atoms/Icon.svelte';

    let {
        apps,
        title,
        description,
        headingLevel = 2,
        headingClass = '',
        class: className = '',
        ...rest
    }: WorksWithProps = $props();

    const i18n = getI18n();
    const uid = $props.id();
    const heading = $derived(`h${headingLevel}` as 'h2' | 'h3');
    const items = $derived(worksWithApps(apps));
    const row = 'flex min-w-0 items-center gap-4 rounded-fc-lg bg-fc-component p-4';
</script>

<!--
@component
Les apps de la suite reliées à celle-ci : pour chacune son icône, son nom, une ligne sur ce qu'elles font ensemble et, si on la donne, un lien vers sa page. Une colonne sur téléphone, deux puis trois sur grand écran.
-->

{#snippet body(app: WorksWithApp)}
    <span class="flex size-11 shrink-0 items-center justify-center rounded-fc-md bg-fc-surface text-fc-fg">
        <Icon icon={app.icon} size={22} />
    </span>
    <span class="flex min-w-0 flex-1 flex-col gap-0.5">
        <span class="text-fc-md font-semibold text-fc-fg">{app.name}</span>
        <span class="text-fc-sm text-fc-fg-muted">{app.line}</span>
    </span>
{/snippet}

{#if items.length}
    <section aria-labelledby="{uid}-title" class={twMerge('@container flex min-w-0 flex-col gap-8', className)} {...rest}>
        <div class="flex flex-col gap-3">
            <svelte:element this={heading} id="{uid}-title" class={twMerge(LANDING_HEADING, headingClass)}>
                {title ?? i18n.t('landing.worksWith')}
            </svelte:element>
            {#if description}<p class="text-fc-md text-fc-fg-muted">{description}</p>{/if}
        </div>
        <ul class="grid min-w-0 gap-3 @xl:grid-cols-2 @4xl:grid-cols-3">
            {#each items as app (app.name)}
                <li class="flex min-w-0">
                    {#if app.href}
                        <a
                            href={app.href}
                            class={twMerge(
                                row,
                                'w-full transition-colors hover:bg-fc-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring'
                            )}
                        >
                            {@render body(app)}
                            <Icon icon={icons.arrow} size={18} class="text-fc-fg-muted" />
                        </a>
                    {:else}
                        <div class={twMerge(row, 'w-full')}>{@render body(app)}</div>
                    {/if}
                </li>
            {/each}
        </ul>
    </section>
{/if}

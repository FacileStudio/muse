<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';

    export type SettingsNavItem = { id: string; label: string; icon?: string; href: string };

    export interface SettingsLayoutProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'> {
        /** Every section of the app. The canonical order is applied unless `ordered` is false. */
        sections: SettingsNavItem[];
        /** The section in the URL. Leave it out on the bare settings address. */
        active?: string;
        /** The bare settings address: where the phone's "back" goes. */
        backHref: string;
        title?: string;
        description?: string;
        backLabel?: string;
        navLabel?: string;
        ordered?: boolean;
        class?: string;
        /** The panel of the current section. It receives that section's id. */
        children: Snippet<[string]>;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { getI18n } from '../../i18n/context.svelte.js';
    import { icons } from '../../icons.js';
    import { orderSections, settingsRoute } from '../../utils/settings-nav.js';
    import Icon from '../atoms/Icon.svelte';
    import PageHeader from '../layout/PageHeader.svelte';

    let {
        sections,
        active,
        backHref,
        title,
        description,
        backLabel,
        navLabel,
        ordered = true,
        class: className = '',
        children,
        ...rest
    }: SettingsLayoutProps = $props();

    const i18n = getI18n();
    const items = $derived(ordered ? orderSections(sections) : sections);
    const route = $derived(settingsRoute(active, items));

    const row =
        'flex min-h-11 items-center gap-2.5 rounded-fc-md px-3 text-fc-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring';

    function look(id: string): string {
        if (id !== route.current) return 'text-fc-fg-muted hover:bg-fc-surface hover:text-fc-fg';
        const solid = 'bg-fc-accent text-fc-accent-fg';
        return route.drilled ? solid : 'text-fc-fg-muted hover:bg-fc-surface hover:text-fc-fg lg:bg-fc-accent lg:text-fc-accent-fg';
    }
</script>

<!--
@component
Le cadre des réglages : une navigation par sections à gauche dès 64rem, une liste qui s'ouvre sur le panneau au téléphone. La section vit dans l'URL.
-->

<div class={twMerge('flex flex-col gap-6', className)} {...rest}>
    <PageHeader title={title ?? i18n.t('settings.title')} {description} />

    <div class="grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <nav
            aria-label={navLabel ?? i18n.t('settings.sections')}
            class={twMerge('flex flex-col gap-1 lg:sticky lg:top-6 lg:self-start', route.drilled && 'max-lg:hidden')}
        >
            {#each items as item (item.id)}
                <a
                    href={item.href}
                    aria-current={item.id === route.current && (route.drilled || undefined) ? 'page' : undefined}
                    class={twMerge(row, look(item.id))}
                >
                    {#if item.icon}<Icon icon={item.icon} size={18} class="shrink-0" />{/if}
                    <span class="min-w-0 flex-1 truncate">{item.label}</span>
                    <Icon icon={icons.arrow} size={16} class="shrink-0 opacity-60 lg:hidden" />
                </a>
            {/each}
        </nav>

        <div class={twMerge('flex min-w-0 flex-col gap-10', !route.drilled && 'max-lg:hidden')}>
            <a
                href={backHref}
                class="-mb-4 inline-flex min-h-11 w-fit items-center gap-1.5 rounded-fc-md text-fc-sm font-medium text-fc-fg-muted transition-colors hover:text-fc-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring lg:hidden"
            >
                <Icon icon={icons.chevronLeft} size={16} />
                {backLabel ?? i18n.t('settings.back')}
            </a>
            {@render children(route.current)}
        </div>
    </div>
</div>

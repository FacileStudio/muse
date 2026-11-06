<script module lang="ts">
    import type { HTMLAnchorAttributes } from 'svelte/elements';
    import { icons } from '../../icons.js';

    export type Platform = 'macos' | 'windows' | 'linux' | 'android' | 'ios';

    export interface DownloadCtaProps extends Omit<HTMLAnchorAttributes, 'href'> {
        /** The app's downloads page. An unsafe value renders nothing. */
        href: string;
        platforms?: Platform[];
        label?: string;
        class?: string;
    }

    export const PLATFORMS: Readonly<Record<Platform, { name: string; icon: string }>> = {
        macos: { name: 'macOS', icon: icons.apple },
        ios: { name: 'iOS', icon: icons.apple },
        windows: { name: 'Windows', icon: icons.windows },
        linux: { name: 'Linux', icon: icons.linux },
        android: { name: 'Android', icon: icons.android }
    };
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { getI18n } from '../../i18n/context.svelte.js';
    import { isSafeHref } from '../../utils/href.js';
    import Icon from '../atoms/Icon.svelte';

    let {
        href,
        platforms = ['macos', 'windows', 'linux', 'android'],
        label,
        class: className = '',
        ...rest
    }: DownloadCtaProps = $props();

    const i18n = getI18n();
    const known = $derived(platforms.filter((p, i) => Object.hasOwn(PLATFORMS, p) && platforms.indexOf(p) === i));
    const names = $derived(
        new Intl.ListFormat(i18n.locale, { type: 'conjunction' }).format(known.map((p) => PLATFORMS[p].name))
    );

    const classes = $derived(
        twMerge(
            'inline-flex min-h-11 self-start flex-wrap items-center gap-x-3 gap-y-1 rounded-fc-pill bg-fc-surface px-5 py-2 text-fc-sm font-medium text-fc-fg transition-colors hover:bg-fc-component focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring',
            className
        )
    );
</script>

<!--
@component
Un lien vers la page de téléchargement d'une app, avec les plateformes disponibles en icônes et en toutes lettres pour les lecteurs d'écran.
-->

{#if isSafeHref(href)}
    <a {href} rel="external" class={classes} {...rest}>
        <Icon icon={icons.download} size={18} />
        <span>{label ?? i18n.t('download.title')}</span>
        {#if known.length}
            <span class="inline-flex items-center gap-1.5 text-fc-fg-muted" aria-hidden="true">
                {#each known as platform (platform)}
                    <Icon icon={PLATFORMS[platform].icon} size={16} />
                {/each}
            </span>
            <span class="sr-only">{i18n.t('download.platforms', { platforms: names })}</span>
        {/if}
    </a>
{/if}

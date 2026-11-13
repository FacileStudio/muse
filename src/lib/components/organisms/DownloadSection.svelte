<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import type { CliCommand, DownloadEntry, Platform } from '../../utils/download.js';

    export type { CliCommand, DownloadEntry };

    export interface DownloadSectionProps extends HTMLAttributes<HTMLElement> {
        /** Every file on offer. Grouped by platform, unsafe and repeated hrefs dropped. */
        downloads?: DownloadEntry[];
        /** Copyable install commands, shown in a terminal card after the platforms. */
        commands?: CliCommand[];
        /** The platform to recommend. Omitted, it is read from `navigator` after hydration; `null` recommends none. */
        platform?: Platform | null;
        /** "All releases" link under the cards. An unsafe value renders nothing. */
        releasesHref?: string;
        /** Link to the release's checksum file, next to `releasesHref`. */
        checksumsHref?: string;
        /** Level of the card headings, so they nest under the page's own. @default 2 */
        headingLevel?: 2 | 3 | 4;
        /** Overrides the terminal card title. */
        cliTitle?: string;
        /** Overrides the terminal card hint. */
        cliHint?: string;
        class?: string;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { getI18n } from '../../i18n/context.svelte.js';
    import { isSafeHref } from '../../utils/href.js';
    import { detectPlatform, entryDetail, groupDownloads, uniqueCommands } from '../../utils/download.js';
    import { icons } from '../../icons.js';
    import { PLATFORMS } from '../molecules/DownloadCta.svelte';
    import Icon from '../atoms/Icon.svelte';
    import Badge from '../atoms/Badge.svelte';
    import Button from '../atoms/Button.svelte';
    import IconButton from '../atoms/IconButton.svelte';

    let {
        downloads = [],
        commands = [],
        platform,
        releasesHref,
        checksumsHref,
        headingLevel = 2,
        cliTitle,
        cliHint,
        class: className = '',
        ...rest
    }: DownloadSectionProps = $props();

    const i18n = getI18n();
    const heading = $derived(`h${headingLevel}`);

    let detected = $state<Platform | null>(null);
    let copied = $state<number | null>(null);
    let status = $state('');

    $effect(() => {
        if (platform !== undefined) return;
        detected = detectPlatform(navigator.userAgent, navigator.maxTouchPoints);
    });

    const featured = $derived(platform === undefined ? detected : platform);
    const groups = $derived(groupDownloads(downloads, featured));
    const cli = $derived(uniqueCommands(commands));
    const releases = $derived(isSafeHref(releasesHref) ? releasesHref : null);
    const checksums = $derived(isSafeHref(checksumsHref) ? checksumsHref : null);

    $effect(() => {
        if (copied === null) return;
        const timer = setTimeout(() => (copied = null), 2000);
        return () => clearTimeout(timer);
    });

    async function copy(index: number) {
        try {
            await navigator.clipboard.writeText(cli[index].command);
            copied = index;
            status = i18n.t('download.copied');
        } catch {
            status = i18n.t('download.copyFailed');
        }
    }

    const classes = $derived(twMerge('flex min-w-0 flex-col gap-4', className));
    const link = 'underline underline-offset-2 transition-colors hover:text-fc-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring';
</script>

<!--
@component
Une section de téléchargement complète : une carte par plateforme (ordinateur, mobile) avec ses fichiers, celle du visiteur en premier, et les commandes d'installation à copier pour le terminal.
-->

<section class={classes} {...rest}>
    {#if groups.length}
        <ul class="grid gap-4 sm:grid-cols-2">
            {#each groups as group (group.platform)}
                {@const name = PLATFORMS[group.platform].name}
                {@const recommended = group.platform === featured}
                <li class="flex min-w-0 flex-col gap-4 rounded-fc-lg bg-fc-component p-5" data-platform={group.platform}>
                    <div class="flex items-center gap-3">
                        <span class="flex size-10 shrink-0 items-center justify-center rounded-fc-md bg-fc-surface text-fc-fg">
                            <Icon icon={PLATFORMS[group.platform].icon} size={20} />
                        </span>
                        <div class="flex min-w-0 flex-col">
                            <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
                                <svelte:element this={heading} class="text-fc-md font-semibold text-fc-fg">{name}</svelte:element>
                                {#if recommended}<Badge tone="accent">{i18n.t('download.recommended')}</Badge>{/if}
                            </div>
                            <span class="text-fc-xs text-fc-fg-muted">
                                {i18n.t(group.platform === 'ios' || group.platform === 'android' ? 'download.mobile' : 'download.desktop')}
                            </span>
                        </div>
                    </div>
                    <ul class="mt-auto flex flex-col gap-3">
                        {#each group.entries as entry, i (entry.href)}
                            {@const file = entry.label ?? name}
                            {@const detail = entryDetail(entry, i18n.locale)}
                            <li class="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                                <div class="flex min-w-0 flex-col">
                                    <span class="text-fc-sm font-medium text-fc-fg">{file}</span>
                                    {#if detail || entry.checksumHref}
                                        <span class="text-fc-xs text-fc-fg-muted tabular-nums">
                                            {detail}{#if detail && entry.checksumHref}{' · '}{/if}{#if entry.checksumHref}<a href={entry.checksumHref} class={link}>{i18n.t('download.checksum')}</a>{/if}
                                        </span>
                                    {/if}
                                </div>
                                <Button
                                    href={entry.href}
                                    rel="external"
                                    variant={recommended && i === 0 ? 'primary' : 'secondary'}
                                    icon={icons.download}
                                    class="h-11"
                                    aria-label={i18n.t('download.fileFor', { file, platform: name })}
                                >
                                    {i18n.t('download.action')}
                                </Button>
                            </li>
                        {/each}
                    </ul>
                </li>
            {/each}
        </ul>
    {/if}

    {#if cli.length}
        <div class="flex min-w-0 flex-col gap-4 rounded-fc-lg bg-fc-component p-5">
            <div class="flex items-center gap-3">
                <span class="flex size-10 shrink-0 items-center justify-center rounded-fc-md bg-fc-surface text-fc-fg">
                    <Icon icon={icons.code} size={20} />
                </span>
                <div class="flex min-w-0 flex-col">
                    <svelte:element this={heading} class="text-fc-md font-semibold text-fc-fg">
                        {cliTitle ?? i18n.t('download.cli')}
                    </svelte:element>
                    <span class="text-fc-xs text-fc-fg-muted">{cliHint ?? i18n.t('download.cliHint')}</span>
                </div>
            </div>
            <ul class="flex flex-col gap-3">
                {#each cli as item, i (item.command)}
                    <li class="flex min-w-0 flex-col gap-1.5">
                        <span class="text-fc-xs font-medium text-fc-fg-muted">{item.label}</span>
                        <div class="flex min-w-0 items-center gap-2 rounded-fc-md bg-fc-inverse py-0.5 pr-0.5 pl-3.5">
                            <code class="flex min-w-0 flex-1 gap-2 overflow-x-auto font-fc-mono text-fc-sm whitespace-nowrap text-fc-on-inverse">
                                <span class="select-none text-fc-on-inverse-muted" aria-hidden="true">$</span>{item.command}
                            </code>
                            <IconButton
                                type="button"
                                variant="ghost"
                                onclick={() => copy(i)}
                                aria-label={i18n.t('download.copy', { label: item.label })}
                                class={twMerge(
                                    'text-fc-on-inverse-muted hover:bg-fc-on-inverse/10 hover:text-fc-on-inverse',
                                    copied === i && 'text-fc-on-inverse'
                                )}
                            >
                                <Icon icon={copied === i ? icons.check : icons.copy} size={18} />
                            </IconButton>
                        </div>
                    </li>
                {/each}
            </ul>
            <span aria-live="polite" class="sr-only">{status}</span>
        </div>
    {/if}

    {#if releases || checksums}
        <p class="flex flex-wrap gap-x-4 gap-y-2 text-fc-xs text-fc-fg-muted">
            {#if releases}<a href={releases} rel="external" class={link}>{i18n.t('download.releases')}</a>{/if}
            {#if checksums}<a href={checksums} rel="external" class={link}>{i18n.t('download.checksums')}</a>{/if}
        </p>
    {/if}
</section>

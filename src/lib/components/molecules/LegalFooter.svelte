<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import type { Locale } from '../../i18n/locale.js';

    export interface LegalFooterProps extends HTMLAttributes<HTMLElement> {
        /** Terms of use. Defaults to Registre's page in the current locale. */
        cgu?: string;
        /** Terms of sale. */
        cgv?: string;
        privacy?: string;
        legalNotice?: string;
        /** Where the four defaults live: `<base>/<doc>?lang=<locale>`. */
        base?: string;
        /** Hide the language switcher. */
        hideLocaleSwitch?: boolean;
        onLocaleChange?: (locale: Locale) => void;
        class?: string;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { getI18n } from '../../i18n/context.svelte.js';
    import { LEGAL_BASE, legalUrl, type LegalDoc } from '../../utils/legal.js';
    import { safeHref } from '../../utils/href.js';
    import LocaleSwitch from './LocaleSwitch.svelte';

    let {
        cgu,
        cgv,
        privacy,
        legalNotice,
        base = LEGAL_BASE,
        hideLocaleSwitch = false,
        onLocaleChange,
        class: className = '',
        ...rest
    }: LegalFooterProps = $props();

    const i18n = getI18n();

    const link = (doc: LegalDoc, href: string | undefined) => safeHref(href, legalUrl(doc, i18n.known ? i18n.locale : null, base));

    const links = $derived([
        { href: link('cgu', cgu), label: i18n.t('legal.cgu') },
        { href: link('cgv', cgv), label: i18n.t('legal.cgv') },
        { href: link('privacy', privacy), label: i18n.t('legal.privacy') },
        { href: link('legal-notice', legalNotice), label: i18n.t('legal.legalNotice') }
    ]);

    const classes = $derived(
        twMerge('flex flex-col items-center gap-4 text-fc-xs text-fc-fg-muted sm:flex-row sm:justify-between', className)
    );
</script>

<!--
@component
Le pied de page légal : CGU, CGV, confidentialité et mentions légales hébergées par Registre, plus le choix de langue.
-->

<footer class={classes} {...rest}>
    <nav aria-label={i18n.t('legal.nav')}>
        <ul class="flex flex-wrap justify-center gap-x-4 gap-y-1">
            {#each links as link (link.label)}
                <li>
                    <a
                        href={link.href}
                        rel="external"
                        class="inline-flex min-h-11 items-center rounded-fc-xs underline-offset-2 hover:text-fc-fg hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring"
                    >
                        {link.label}
                    </a>
                </li>
            {/each}
        </ul>
    </nav>
    {#if !hideLocaleSwitch}
        <LocaleSwitch onChange={onLocaleChange} />
    {/if}
</footer>

<script module lang="ts">
    import type { HTMLAnchorAttributes } from 'svelte/elements';

    export type SignInSize = 'sm' | 'md' | 'lg';

    export interface SignInWithFacileProps extends Omit<HTMLAnchorAttributes, 'href'> {
        /**
         * The app's porte sign-in route. Anything but a same-origin path or https URL falls back to
         * `/auth/oidc`. When the locale is known it gains `ui_locales=<locale>` for porte to forward.
         */
        href?: string;
        size?: SignInSize;
        /** Stretch to the width of the container. */
        fullWidth?: boolean;
        /** Shows the spinner and stops a second navigation. Also set by the first click. */
        loading?: boolean;
        /** Overrides the canonical label. Leave it unset: the label is part of the mark. */
        label?: string;
        class?: string;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { getI18n } from '../../i18n/context.svelte.js';
    import { safeHref, withParam } from '../../utils/href.js';
    import Spinner from './Spinner.svelte';

    let {
        href: hrefProp,
        size = 'md',
        fullWidth = false,
        loading = false,
        label,
        class: className = '',
        onclick,
        ...rest
    }: SignInWithFacileProps = $props();

    const i18n = getI18n();
    const safe = $derived(safeHref(hrefProp, '/auth/oidc'));
    const href = $derived(i18n.known ? withParam(safe, 'ui_locales', i18n.locale) : safe);
    let pending = $state(false);
    const busy = $derived(loading || pending);
    const name = $derived(label ?? i18n.t('signIn.label'));

    const sizes: Record<SignInSize, { box: string; mark: number }> = {
        sm: { box: 'h-10 gap-2 px-4 text-fc-sm', mark: 16 },
        md: { box: 'h-11 gap-2.5 px-5 text-fc-sm', mark: 18 },
        lg: { box: 'h-12 gap-3 px-6 text-fc-md', mark: 20 }
    };

    const classes = $derived(
        twMerge(
            'inline-flex shrink-0 items-center justify-center rounded-fc-pill bg-fc-accent font-semibold whitespace-nowrap text-fc-accent-fg transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring aria-busy:cursor-progress aria-busy:opacity-80',
            sizes[size].box,
            fullWidth && 'w-full',
            className
        )
    );

    function handleClick(event: MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement }) {
        if (busy) {
            event.preventDefault();
            return;
        }
        onclick?.(event);
        const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
        const elsewhere = Boolean(rest.target) && rest.target !== '_self';
        if (!event.defaultPrevented && !modified && !elsewhere) pending = true;
    }

    $effect(() => {
        const reset = (event: PageTransitionEvent) => {
            if (event.persisted) pending = false;
        };
        window.addEventListener('pageshow', reset);
        return () => window.removeEventListener('pageshow', reset);
    });
</script>

<!--
@component
Le bouton « Se connecter avec Facile », le seul : la marque, le libellé canonique dans la langue de la session, un lien vers la route `/auth/oidc` de porte.
-->

<a
    {href}
    rel="external"
    data-sveltekit-reload
    aria-busy={busy ? 'true' : undefined}
    aria-disabled={busy ? 'true' : undefined}
    class={classes}
    onclick={handleClick}
    {...rest}
>
    {#if busy}
        <Spinner size="sm" aria-hidden="true" class="border-fc-accent-fg/30 border-t-fc-accent-fg" />
    {:else}
        <svg
            width={sizes[size].mark}
            height={sizes[size].mark}
            viewBox="0 0 217 225"
            fill="currentColor"
            aria-hidden="true"
            class="block shrink-0"
        >
            <path
                d="M21.6 2.10177L23.4 2.70176C19.5 17.4018 27.9 37.8018 42 37.8018C71.4 37.8018 95.1 -0.298234 137.1 0.00176235C170.1 0.00176235 177.3 29.4018 177.3 43.5018V64.8018H131.7L131.4 46.5018C131.4 25.5018 120.3 20.7018 107.7 20.7018C65.7 20.7018 49.8 80.1018 27.3 80.1018C14.7 80.1018 11.4 62.7018 11.4 49.2018C11.4 29.1018 16.5 10.5018 21.6 2.10177ZM53.4 109.202L81.9 46.2018H121.2C109.8 68.1018 100.2 89.4018 91.5 109.202H94.8C129.9 109.202 157.8 117.902 157.8 163.802L112.8 163.202C113.1 121.202 111.9 114.002 95.1 114.002H89.1C60.6 177.902 40.2 225.002 0 225.002L0.3 175.802V109.202H53.4ZM2.7 138.302V175.802C18.3 174.902 32.1 156.902 40.8 137.102L51 114.302C12.3 115.802 2.7 120.602 2.7 138.302Z"
            />
            <path d="M179.198 223.502V186.902H216.098V223.502H179.198Z" />
        </svg>
    {/if}
    <span>{busy ? i18n.t('signIn.loading') : name}</span>
</a>

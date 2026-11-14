<script module lang="ts">
    import type { HTMLAnchorAttributes } from 'svelte/elements';
    import type { SignInSize } from './SignInWithFacile.svelte';

    export interface SignUpWithFacileProps extends Omit<HTMLAnchorAttributes, 'href'> {
        /**
         * Registre's account creation page, `https://sso.facile.studio/signup` by default. Anything but a
         * same-origin path or https URL falls back to it. When the locale is known it gains `lang=<locale>`.
         * Registre has no sign-up entry from an app's porte route: after creating the account the visitor
         * is signed in on Registre, and the app's `SignInWithFacile` then completes without a password.
         */
        href?: string;
        /** Same heights as `SignInWithFacile`, so the two line up in `LandingCta`. @default 'md' */
        size?: SignInSize;
        /** Stretch to the width of the container. */
        fullWidth?: boolean;
        /** Overrides the canonical label, for a legal or accessibility need only. */
        label?: string;
        class?: string;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { getI18n } from '../../i18n/context.svelte.js';
    import { safeHref, withParam } from '../../utils/href.js';
    import { SIGNUP_URL } from '../../utils/legal.js';

    let {
        href: hrefProp,
        size = 'md',
        fullWidth = false,
        label,
        class: className = '',
        ...rest
    }: SignUpWithFacileProps = $props();

    const i18n = getI18n();
    const safe = $derived(safeHref(hrefProp, SIGNUP_URL));
    const href = $derived(i18n.known ? withParam(safe, 'lang', i18n.locale) : safe);

    const sizes: Record<SignInSize, string> = {
        sm: 'h-10 px-4 text-fc-sm',
        md: 'h-11 px-5 text-fc-sm',
        lg: 'h-12 px-6 text-fc-md'
    };

    const classes = $derived(
        twMerge(
            'inline-flex shrink-0 items-center justify-center rounded-fc-pill bg-fc-accent font-semibold whitespace-nowrap text-fc-accent-fg transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring',
            sizes[size],
            fullWidth && 'w-full',
            className
        )
    );
</script>

<!--
@component
Le bouton « Créer un compte gratuit » : une pilule pleine qui mène à la page d'inscription de Registre, dans la langue de la session. C'est l'action principale d'une page d'accueil ; `LandingCta` le pose à côté de « Se connecter avec Facile ».
-->

<a {href} rel="external" data-sveltekit-reload class={classes} {...rest}>{label ?? i18n.t('signUp.label')}</a>

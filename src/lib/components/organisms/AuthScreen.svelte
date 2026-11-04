<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import type { Locale } from '../../i18n/locale.js';
    import type { LegalFooterProps } from '../molecules/LegalFooter.svelte';

    export interface AuthScreenProps extends HTMLAttributes<HTMLDivElement> {
        appName: string;
        /** The app's porte sign-in route. */
        href?: string;
        /** Registre's sign-up page. Defaults to `signUpUrl(locale)`; `null` hides the line. */
        signUpHref?: string | null;
        loading?: boolean;
        logo?: Snippet;
        tagline?: Snippet;
        /** Above the button: a session-expired or sign-in error `Alert`. */
        notice?: Snippet;
        /** Overrides for the four legal links. */
        legal?: Omit<LegalFooterProps, 'class' | 'onLocaleChange'>;
        onLocaleChange?: (locale: Locale) => void;
        class?: string;
    }
</script>

<script lang="ts">
    import { gsap } from 'gsap';
    import { twMerge } from '../../utils/cn.js';
    import { getI18n } from '../../i18n/context.svelte.js';
    import { prefersReducedMotion } from '../../utils/motion.js';
    import { signUpUrl } from '../../utils/legal.js';
    import SignInWithFacile from '../atoms/SignInWithFacile.svelte';
    import LegalFooter from '../molecules/LegalFooter.svelte';

    let {
        appName,
        href = '/auth/oidc',
        signUpHref,
        loading = false,
        logo,
        tagline,
        notice,
        legal,
        onLocaleChange,
        class: className = '',
        ...rest
    }: AuthScreenProps = $props();

    const i18n = getI18n();
    const headingId = $props.id();
    const signUp = $derived(signUpHref === undefined ? signUpUrl(i18n.locale) : signUpHref);
    let card: HTMLElement | null = $state(null);

    $effect(() => {
        if (!card || prefersReducedMotion()) return;
        const tween = gsap.from(card, { opacity: 0, y: 12, duration: 0.5, ease: 'power3.inOut' });
        return () => tween.kill();
    });
</script>

<!--
@component
L'écran de connexion de toute app de la suite : nom et logo, une phrase, le bouton « Se connecter avec Facile », le lien d'inscription Registre et le pied légal. Aucun champ de mot de passe.
-->

<div
    class={twMerge('flex min-h-dvh w-full flex-col items-center justify-between gap-10 bg-fc-page px-4 py-10', className)}
    {...rest}
>
    <div aria-hidden="true"></div>
    <section
        bind:this={card}
        aria-labelledby={headingId}
        class="flex w-full max-w-[360px] flex-col items-center gap-6 rounded-fc-lg bg-fc-component p-6 text-center"
    >
        <div class="flex flex-col items-center gap-3">
            {#if logo}{@render logo()}{/if}
            <h1 id={headingId} class="text-fc-xl font-semibold text-fc-fg">{appName}</h1>
            {#if tagline}
                <p class="text-fc-sm text-fc-fg-muted">{@render tagline()}</p>
            {/if}
        </div>
        {#if notice}<div class="w-full text-left">{@render notice()}</div>{/if}
        <SignInWithFacile {href} {loading} size="lg" fullWidth />
        {#if signUp}
            <p class="text-fc-sm text-fc-fg-muted">
                {i18n.t('auth.newHere')}
                <a
                    href={signUp}
                    rel="external"
                    class="rounded-fc-xs font-medium text-fc-fg underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring"
                >
                    {i18n.t('auth.createAccount')}
                </a>
            </p>
        {/if}
    </section>
    <LegalFooter {...legal} {onLocaleChange} class="w-full max-w-3xl" />
</div>

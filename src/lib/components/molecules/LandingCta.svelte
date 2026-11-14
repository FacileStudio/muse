<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import type { SignInSize } from '../atoms/SignInWithFacile.svelte';

    export interface LandingCtaProps extends HTMLAttributes<HTMLDivElement> {
        /** The app's porte sign-in route, as for `SignInWithFacile`. @default '/auth/oidc' */
        signInHref?: string;
        /** Registre's sign-up page, as for `SignUpWithFacile`. @default 'https://sso.facile.studio/signup' */
        signUpHref?: string;
        /** @default 'lg' */
        size?: SignInSize;
        /** `center` for a closing call to action under a centred heading. @default 'start' */
        align?: 'start' | 'center';
        class?: string;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import SignInWithFacile from '../atoms/SignInWithFacile.svelte';
    import SignUpWithFacile from '../atoms/SignUpWithFacile.svelte';

    let {
        signInHref,
        signUpHref,
        size = 'lg',
        align = 'start',
        class: className = '',
        ...rest
    }: LandingCtaProps = $props();

    const classes = $derived(
        twMerge(
            'flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center',
            align === 'center' && 'sm:justify-center',
            className
        )
    );
</script>

<!--
@component
La paire de boutons d'une page d'accueil : « Créer un compte gratuit » en action principale, « Se connecter avec Facile » en action secondaire, à la même hauteur sur une ligne, l'un sous l'autre en pleine largeur sur téléphone.
-->

<div class={classes} {...rest}>
    <SignUpWithFacile href={signUpHref} {size} class="max-sm:w-full" />
    <SignInWithFacile href={signInHref} {size} variant="secondary" class="max-sm:w-full" />
</div>

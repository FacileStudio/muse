<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';

    export interface StepNavProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
        /** The label of the main button: "Continue", "Finish". */
        primary: string;
        /** Disables the buttons and shows a spinner in the main one. */
        busy?: boolean;
        /** The last step: the main button loses its arrow. */
        final?: boolean;
        canBack?: boolean;
        canSkip?: boolean;
        /** Defaults to the translated "Back". */
        backLabel?: string;
        /** Defaults to the translated "Skip for now". */
        skipLabel?: string;
        onContinue: () => void;
        onBack?: () => void;
        onSkip?: () => void;
        class?: string;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { getI18n } from '../../i18n/context.svelte.js';
    import { icons } from '../../icons.js';
    import Button from '../atoms/Button.svelte';
    import Spinner from '../atoms/Spinner.svelte';

    let {
        primary,
        busy = false,
        final = false,
        canBack = false,
        canSkip = false,
        backLabel,
        skipLabel,
        onContinue,
        onBack,
        onSkip,
        class: className = '',
        ...rest
    }: StepNavProps = $props();

    const i18n = getI18n();
</script>

<!--
@component
Le pied d'un parcours en plusieurs étapes : un bouton principal pleine largeur, puis « Retour » à gauche et « Passer » à droite. Les zones tactiles font 44px et le pied respecte la zone sûre en bas de l'écran.
-->

<footer
    class={twMerge('px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-8', className)}
    {...rest}
>
    <div class="mx-auto flex w-full max-w-fc-sm flex-col gap-1">
        <Button size="lg" class="w-full rounded-fc-md" iconRight={final ? undefined : icons.arrow} disabled={busy} onclick={onContinue}>
            {#if busy}<Spinner size="sm" />{/if}
            {primary}
        </Button>
        <div class="flex min-h-11 items-center justify-between">
            {#if canBack}
                <Button variant="ghost" size="lg" class="px-3" disabled={busy} onclick={onBack}>{backLabel ?? i18n.t('stepper.back')}</Button>
            {:else}
                <span></span>
            {/if}
            {#if canSkip}
                <Button variant="ghost" size="lg" class="px-3" onclick={onSkip}>{skipLabel ?? i18n.t('stepper.skip')}</Button>
            {/if}
        </div>
    </div>
</footer>

<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';

    export interface StepperItem {
        /** Stable key for the step. Defaults to its position. */
        id?: string;
        label: string;
        /** A second line under the label, `steps` variant only. */
        description?: string;
    }

    export interface StepperProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
        steps: StepperItem[];
        /** The index of the current step, starting at 0. */
        current: number;
        /** Indexes of finished steps. Defaults to every step before `current`. */
        done?: number[];
        /** `steps` draws a numbered marker per step. `compact` is a segmented progress bar with "Step 2 of 5" and the current label. @default 'steps' */
        variant?: 'steps' | 'compact';
        /** Direction of the `steps` variant. @default 'horizontal' */
        orientation?: 'horizontal' | 'vertical';
        /** Makes finished steps buttons that go back to that step. */
        onSelect?: (index: number) => void;
        /** Accessible name. Defaults to the translated "Progress". */
        label?: string;
        class?: string;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { getI18n } from '../../i18n/context.svelte.js';
    import { icons } from '../../icons.js';
    import { clampStep, stepState, type StepState } from '../../utils/stepper.js';
    import Icon from '../atoms/Icon.svelte';

    let {
        steps,
        current,
        done,
        variant = 'steps',
        orientation = 'horizontal',
        onSelect,
        label,
        class: className = '',
        ...rest
    }: StepperProps = $props();

    const i18n = getI18n();

    const index = $derived(clampStep(current, steps.length));
    const vertical = $derived(orientation === 'vertical');
    const stepOf = $derived(i18n.t('stepper.stepOf', { step: index + 1, total: steps.length }));
    const name = $derived(label ?? i18n.t('stepper.label'));
    const states = $derived(steps.map((_, i) => stepState(i, index, done)));

    const row = 'flex min-h-11 min-w-0 items-center gap-2 rounded-fc-md text-fc-sm';

    const markers = {
        done: 'bg-fc-surface text-fc-fg',
        current: 'bg-fc-accent text-fc-accent-fg',
        upcoming: 'bg-fc-surface text-fc-fg-muted'
    };
</script>

<!--
@component
Les étapes d'un parcours : une liste numérotée avec l'étape courante et les étapes faites, ou une barre de progression compacte « Étape 2 sur 5 ». Les étapes faites peuvent devenir des boutons pour revenir en arrière.
-->

{#snippet content(step: StepperItem, i: number, state: StepState)}
    <span
        class={twMerge(
            'inline-flex size-8 shrink-0 items-center justify-center rounded-fc-pill text-fc-xs font-medium transition-colors motion-reduce:transition-none',
            markers[state]
        )}
    >
        {#if state === 'done'}
            <Icon icon={icons.check} size={16} />
        {:else}
            {i + 1}
        {/if}
    </span>
    <span class={twMerge('flex min-w-0 flex-col text-left', state !== 'current' && !vertical && 'max-sm:sr-only')}>
        <span class={twMerge('truncate', state === 'current' ? 'font-medium text-fc-fg' : 'text-fc-fg-muted')}>{step.label}</span>
        {#if step.description}
            <span class="truncate text-fc-xs text-fc-fg-muted">{step.description}</span>
        {/if}
    </span>
    {#if state !== 'upcoming'}
        <span class="sr-only">{i18n.t(state === 'done' ? 'stepper.done' : 'stepper.current')}</span>
    {/if}
{/snippet}

{#if variant === 'compact'}
    <div class={twMerge('flex w-full flex-col gap-2', className)} {...rest}>
        <div class="flex items-center justify-between text-fc-xs text-fc-fg-muted">
            <span>{stepOf}</span>
            <span>{steps[index]?.label}</span>
        </div>
        <div
            role="progressbar"
            aria-label={name}
            aria-valuemin={1}
            aria-valuemax={Math.max(steps.length, 1)}
            aria-valuenow={index + 1}
            aria-valuetext="{stepOf}: {steps[index]?.label}"
            class="flex gap-1.5"
        >
            {#each steps as step, i (step.id ?? i)}
                <span
                    class={twMerge(
                        'h-1.5 flex-1 rounded-fc-pill transition-colors duration-500 motion-reduce:transition-none',
                        i <= index ? 'bg-fc-accent' : 'bg-fc-surface'
                    )}
                ></span>
            {/each}
        </div>
    </div>
{:else}
    <ol
        aria-label={name}
        class={twMerge('flex', vertical ? 'flex-col' : 'w-full items-start', className)}
        {...rest as HTMLAttributes<HTMLOListElement>}
    >
        {#each steps as step, i (step.id ?? i)}
            {@const state = states[i]}
            {@const selectable = Boolean(onSelect) && state === 'done'}
            <li
                aria-current={state === 'current' ? 'step' : undefined}
                class={twMerge('flex min-w-0', vertical ? 'flex-col' : 'items-center', !vertical && i < steps.length - 1 && 'flex-1')}
            >
                {#if selectable}
                    <button type="button" onclick={() => onSelect?.(i)} class={twMerge(row, 'cursor-pointer hover:bg-fc-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring')}>
                        {@render content(step, i, state)}
                    </button>
                {:else}
                    <div class={row}>
                        {@render content(step, i, state)}
                    </div>
                {/if}
                {#if i < steps.length - 1}
                    <span
                        aria-hidden="true"
                        class={twMerge(
                            'rounded-fc-pill transition-colors motion-reduce:transition-none',
                            vertical ? 'my-1 ml-[15px] min-h-4 w-0.5' : 'mx-3 h-0.5 min-w-4 flex-1',
                            state === 'done' ? 'bg-fc-accent' : 'bg-fc-surface'
                        )}
                    ></span>
                {/if}
            </li>
        {/each}
    </ol>
{/if}

<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import type { StatusTone } from '../../utils/tone.js';

    export type Tone = StatusTone;

    export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
        tone?: Tone;
        title?: string;
        /** Adds a close button. The alert hides itself and calls `onDismiss`; remembering the choice is the caller's job. */
        dismissible?: boolean;
        /** Whether the alert shows. Bindable, so the caller can bring it back. */
        open?: boolean;
        onDismiss?: () => void;
        /** Accessible name of the close button. Defaults to the translated "Close". */
        dismissLabel?: string;
        /** A button or link at the end of the message. */
        action?: Snippet;
        class?: string;
        children?: Snippet;

    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { isUrgent } from '../../utils/tone.js';
    import { getI18n } from '../../i18n/context.svelte.js';
    import { icons } from '../../icons.js';
    import Icon from './Icon.svelte';

    let {
        tone = 'info',
        title,
        dismissible = false,
        open = $bindable(true),
        onDismiss,
        dismissLabel,
        action,
        class: className = '',
        children,
        ...rest
    }: AlertProps = $props();

    const i18n = getI18n();

    function dismiss() {
        open = false;
        onDismiss?.();
    }

    const tones: Record<Tone, string> = {
        neutral: 'bg-fc-surface text-fc-fg',
        info: 'bg-fc-info/10 text-fc-info',
        success: 'bg-fc-success/10 text-fc-success',
        warning: 'bg-fc-warning/10 text-fc-warning',
        danger: 'bg-fc-danger/10 text-fc-danger'
    };

    const role = $derived(isUrgent(tone) ? 'alert' : 'status');

    const classes = $derived(twMerge('rounded-fc-md p-3 text-fc-sm', tones[tone], className));
</script>

<!--
@component
Un message qui reste à l'écran. Pour un retour qui passe, c'est un toast.
-->

{#if open}
    {#if dismissible || action}
        <div class={twMerge(classes, 'flex items-start gap-3')} {role} {...rest}>
            <div class="min-w-0 flex-1">
                {#if title}<p class="font-medium mb-1">{title}</p>{/if}
                {#if children}{@render children()}{/if}
            </div>
            {#if action}<div class="shrink-0">{@render action()}</div>{/if}
            {#if dismissible}
                <button
                    type="button"
                    aria-label={dismissLabel ?? i18n.t('dialog.close')}
                    class="-m-3 -ml-1 inline-flex size-11 shrink-0 items-center justify-center rounded-fc-md transition-colors hover:bg-fc-fg/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring"
                    onclick={dismiss}
                >
                    <Icon icon={icons.close} size={16} />
                </button>
            {/if}
        </div>
    {:else}
        <div class={classes} {role} {...rest}>
            {#if title}<p class="font-medium mb-1">{title}</p>{/if}
            {#if children}{@render children()}{/if}
        </div>
    {/if}
{/if}

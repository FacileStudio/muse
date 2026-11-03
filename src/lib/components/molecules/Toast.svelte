<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import type { ToastAction, ToastTone } from '../../utils/toast.svelte.js';

    export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
        tone?: ToastTone;
        title?: string;
        icon?: string | null;
        action?: ToastAction;
        onDismiss?: () => void;
        class?: string;
        children?: Snippet;

    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import Icon from '../atoms/Icon.svelte';
    import Button from '../atoms/Button.svelte';
    import IconButton from '../atoms/IconButton.svelte';
    import { icons } from '../../icons.js';

    let {
        tone = 'neutral',
        title,
        icon,
        action,
        onDismiss,
        class: className = '',
        children,
        ...rest
    }: ToastProps = $props();

    /*
        A toast floats over content it does not own, so it takes the floating-surface
        treatment from CHARTE §5 — opaque `fc-component` fill and a shadow, no border — and
        not `Alert`'s tinted wash, which would let whatever is underneath bleed through the
        tone. The shadow is what lifts it off arbitrary content with no scrim under it. The
        tone lives in the icon badge instead, tinted the same way `ConfirmModal` tints its own.
    */
    const badges: Record<ToastTone, string> = {
        neutral: 'bg-fc-surface text-fc-fg-muted',
        info: 'bg-fc-info/10 text-fc-info',
        success: 'bg-fc-success/10 text-fc-success',
        warning: 'bg-fc-warning/10 text-fc-warning',
        danger: 'bg-fc-danger/10 text-fc-danger'
    };

    const defaults: Record<ToastTone, string> = {
        neutral: icons.notification,
        info: icons.info,
        success: icons.check,
        warning: icons.warning,
        danger: icons.error
    };

    const glyph = $derived(icon === null ? undefined : (icon ?? defaults[tone]));

    /* Same rule as `Alert`: only a tone the user has to act on earns an assertive region. */
    const role = $derived(tone === 'warning' || tone === 'danger' ? 'alert' : 'status');

    const classes = $derived(
        twMerge(
            'pointer-events-auto flex w-full items-start gap-3 rounded-fc-md bg-fc-component p-4 shadow-lg',
            className
        )
    );
</script>

<!--
@component
La présentation d'un message éphémère. La file et l'auto-fermeture appartiennent à `Toaster`.
-->

<div class={classes} {role} {...rest}>
    {#if glyph}
        <span
            class={twMerge('flex size-8 shrink-0 items-center justify-center rounded-fc-pill', badges[tone])}
            aria-hidden="true"
        >
            <Icon icon={glyph} size={18} />
        </span>
    {/if}

    <div class="flex min-w-0 flex-1 flex-col gap-1 py-1">
        {#if title}<p class="text-fc-sm font-semibold text-fc-fg">{title}</p>{/if}
        {#if children}
            <p class={title ? 'text-fc-sm text-fc-fg-muted' : 'text-fc-sm text-fc-fg'}>
                {@render children()}
            </p>
        {/if}
    </div>

    {#if action}
        <Button variant="outline" size="sm" class="shrink-0" onclick={action.onClick}>
            {action.label}
        </Button>
    {/if}

    {#if onDismiss}
        <IconButton
            variant="ghost"
            class="-my-2 -mr-2 shrink-0"
            aria-label="Dismiss notification"
            onclick={onDismiss}
        >
            <Icon icon={icons.close} size={16} />
        </IconButton>
    {/if}
</div>

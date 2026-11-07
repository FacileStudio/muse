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
    import { isUrgent, toneFill } from '../../utils/tone.js';
    import { getI18n } from '../../i18n/context.svelte.js';
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

    const i18n = getI18n();

    const defaults: Record<ToastTone, string> = {
        neutral: icons.notification,
        accent: icons.notification,
        owner: icons.notification,
        admin: icons.notification,
        info: icons.info,
        success: icons.check,
        warning: icons.warning,
        danger: icons.error
    };

    const glyph = $derived(icon === null ? undefined : (icon ?? defaults[tone]));

    const role = $derived(isUrgent(tone) ? 'alert' : 'status');

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
            class={twMerge('flex size-8 shrink-0 items-center justify-center rounded-fc-pill', toneFill[tone])}
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
        <Button variant="secondary" size="sm" class="shrink-0" onclick={action.onClick}>
            {action.label}
        </Button>
    {/if}

    {#if onDismiss}
        <IconButton
            variant="ghost"
            class="-my-2 -mr-2 shrink-0"
            aria-label={i18n.t('toast.dismiss')}
            onclick={onDismiss}
        >
            <Icon icon={icons.close} size={16} />
        </IconButton>
    {/if}
</div>

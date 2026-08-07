<script lang="ts">
    import type { Snippet } from 'svelte';
    import { twMerge } from '../../utils/cn.js';
    import Button from '../atoms/Button.svelte';
    import Spinner from '../atoms/Spinner.svelte';
    import Modal from './Modal.svelte';

    type Tone = 'default' | 'danger';

    let {
        open = $bindable(false),
        title,
        description,
        confirmLabel = 'Confirm',
        cancelLabel = 'Cancel',
        tone = 'default',
        icon,
        onconfirm,
        oncancel,
        children,
        class: className = ''
    }: {
        open?: boolean;
        title: string;
        description?: string;
        confirmLabel?: string;
        cancelLabel?: string;
        tone?: Tone;
        icon?: string;
        onconfirm?: () => void | Promise<void>;
        oncancel?: () => void;
        children?: Snippet;
        class?: string;
    } = $props();

    let pending = $state(false);
    let confirmed = false;
    let footerEl: HTMLDivElement | null = $state(null);

    const badgeIcon = $derived(icon ?? (tone === 'danger' ? 'solar:danger-triangle-linear' : undefined));
    const badgeClasses = $derived(twMerge('flex size-10 shrink-0 items-center justify-center rounded-fc-pill', tone === 'danger' ? 'bg-fc-danger/10 text-fc-danger' : 'bg-fc-surface text-fc-fg-muted'));

    $effect(() => {
        if (!open || !footerEl) return;
        const el = footerEl;
        const frame = requestAnimationFrame(() => {
            el.querySelector<HTMLButtonElement>('[data-fc-confirm-cancel]')?.focus();
        });
        return () => cancelAnimationFrame(frame);
    });

    function dismiss() {
        if (confirmed) {
            confirmed = false;
            return;
        }
        oncancel?.();
    }

    async function confirm() {
        const result = onconfirm?.();
        if (!(result instanceof Promise)) {
            confirmed = true;
            open = false;
            return;
        }
        pending = true;
        try {
            await result;
            confirmed = true;
            open = false;
        } catch {
            confirmed = false;
        } finally {
            pending = false;
        }
    }
</script>

<Modal bind:open size="sm" dismissible={!pending} onclose={dismiss} class={className}>
    <div class="flex gap-3">
        {#if badgeIcon}
            <span class={badgeClasses} aria-hidden="true">
                <iconify-icon icon={badgeIcon} width="18" height="18" class="block"></iconify-icon>
            </span>
        {/if}
        <div class="flex min-w-0 flex-1 flex-col gap-1">
            <h2 class="text-fc-lg font-semibold">{title}</h2>
            {#if description}
                <p class="text-fc-sm text-fc-fg-muted">{description}</p>
            {/if}
            {#if children}
                <div class="mt-2 text-fc-sm">{@render children()}</div>
            {/if}
        </div>
    </div>

    {#snippet footer()}
        <div bind:this={footerEl} class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
                variant="outline"
                class="w-full sm:w-auto"
                data-fc-confirm-cancel=""
                disabled={pending}
                onclick={() => (open = false)}
            >
                {cancelLabel}
            </Button>
            <Button
                variant={tone === 'danger' ? 'danger' : 'primary'}
                class="w-full sm:w-auto"
                disabled={pending}
                onclick={confirm}
            >
                {#if pending}
                    <Spinner size="sm" class="border-current border-t-transparent" />
                {/if}
                {confirmLabel}
            </Button>
        </div>
    {/snippet}
</Modal>

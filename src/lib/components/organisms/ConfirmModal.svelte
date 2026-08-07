<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { Attachment } from 'svelte/attachments';
    import type { HTMLDialogAttributes } from 'svelte/elements';
    import { twMerge } from '../../utils/cn.js';
    import Button from '../atoms/Button.svelte';
    import Spinner from '../atoms/Spinner.svelte';
    import Modal from './Modal.svelte';

    type Tone = 'neutral' | 'danger';

    let {
        open = $bindable(false),
        title,
        description,
        confirmLabel = 'Confirm',
        cancelLabel = 'Cancel',
        tone = 'neutral',
        icon,
        onConfirm,
        onCancel,
        children,
        class: className = '',
        ...rest
    }: HTMLDialogAttributes & {
        open?: boolean;
        title: string;
        description?: string;
        confirmLabel?: string;
        cancelLabel?: string;
        tone?: Tone;
        icon?: string;
        onConfirm?: () => void | Promise<void>;
        onCancel?: () => void;
        children?: Snippet;
        class?: string;
    } = $props();

    let pending = $state(false);
    let confirmed = false;
    let cancelEl: HTMLElement | null = $state(null);

    /* `Button` renders the <button> itself and exposes no element binding, so the node
       comes back through an attachment — still a direct reference, no DOM query. */
    const captureCancel: Attachment<HTMLElement> = (node) => {
        cancelEl = node;
        return () => {
            cancelEl = null;
        };
    };

    /*
     * The heading stays here rather than moving into Modal's `title` so the icon badge can
     * sit beside it — which means the dialog has to be named from here too, and
     * `aria-labelledby` rides through Modal's `...rest` onto the <dialog>.
     */
    const titleId = $props.id();

    const badgeIcon = $derived(icon ?? (tone === 'danger' ? 'solar:danger-triangle-linear' : undefined));
    const badgeClasses = $derived(twMerge('flex size-10 shrink-0 items-center justify-center rounded-fc-pill', tone === 'danger' ? 'bg-fc-danger/10 text-fc-danger' : 'bg-fc-surface text-fc-fg-muted'));

    /*
     * Focus lands on Cancel, never Confirm: a confirmation dialog that arms the destructive
     * button under the Enter key the user is already holding is a trap. The frame delay is
     * for showModal(), which moves focus itself once the dialog is in the top layer.
     */
    $effect(() => {
        if (!open || !cancelEl) return;
        const el = cancelEl;
        const frame = requestAnimationFrame(() => el.focus());
        return () => cancelAnimationFrame(frame);
    });

    function dismiss() {
        if (confirmed) {
            confirmed = false;
            return;
        }
        onCancel?.();
    }

    async function confirm() {
        const result = onConfirm?.();
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

<Modal
    bind:open
    size="sm"
    dismissible={!pending}
    onClose={dismiss}
    class={className}
    aria-labelledby={titleId}
    {...rest}
>
    <div class="flex gap-3">
        {#if badgeIcon}
            <span class={badgeClasses} aria-hidden="true">
                <iconify-icon icon={badgeIcon} width="18" height="18" class="block"></iconify-icon>
            </span>
        {/if}
        <div class="flex min-w-0 flex-1 flex-col gap-1">
            <h2 id={titleId} class="text-fc-lg font-semibold">{title}</h2>
            {#if description}
                <p class="text-fc-sm text-fc-fg-muted">{description}</p>
            {/if}
            {#if children}
                <div class="mt-2 text-fc-sm">{@render children()}</div>
            {/if}
        </div>
    </div>

    {#snippet footer()}
        <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
                {@attach captureCancel}
                variant="outline"
                class="w-full sm:w-auto"
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

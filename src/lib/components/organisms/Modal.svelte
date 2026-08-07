<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLDialogAttributes } from 'svelte/elements';
    import { gsap } from 'gsap';
    import { twMerge } from '../../utils/cn.js';
    import { createDialog } from '../../utils/dialog.js';
    import { prefersReducedMotion } from '../../utils/motion.js';

    type Size = 'sm' | 'md' | 'lg';

    let {
        open = $bindable(false),
        title,
        dismissible = true,
        showClose = false,
        size = 'md',
        onClose,
        header,
        footer,
        children,
        class: className = '',
        ...rest
    }: HTMLDialogAttributes & {
        open?: boolean;
        title?: string;
        dismissible?: boolean;
        showClose?: boolean;
        size?: Size;
        onClose?: () => void;
        header?: Snippet;
        footer?: Snippet;
        children: Snippet;
        class?: string;
    } = $props();

    const sizes: Record<Size, string> = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg'
    };

    let dialogEl: HTMLDialogElement | null = $state(null);
    let tween: ReturnType<typeof gsap.to> | null = null;

    /*
     * Only the built-in heading can be pointed at: a `header` snippet is arbitrary markup
     * with no id of ours in it, so the label falls to whatever the caller passes through
     * `...rest` — which is exactly how ConfirmModal names itself.
     */
    const headingId = $props.id();
    const labelledBy = $derived(!header && title ? headingId : undefined);

    /*
     * `dialog.handlers` is spread after `rest` in the markup, which is the one place this
     * library lets the component win over the consumer. Those three handlers are what make
     * the dialog dismissible and keep `open` in sync; a consumer passing `onclick` would
     * otherwise silently break closing. Everything else still spreads consumer-last.
     */
    const dialog = createDialog({
        element: () => dialogEl,
        open: () => open,
        setOpen: (value) => (open = value),
        dismissible: () => dismissible,
        enter(el, fresh) {
            tween?.kill();
            tween = null;
            if (prefersReducedMotion()) {
                gsap.set(el, { opacity: 1, scale: 1 });
                return;
            }
            if (fresh) gsap.set(el, { opacity: 0, scale: 0.97 });
            tween = gsap.to(el, {
                opacity: 1,
                scale: 1,
                duration: 0.2,
                ease: 'power3.out',
                onComplete: () => (tween = null)
            });
        },
        exit(el, done) {
            tween?.kill();
            tween = null;
            if (prefersReducedMotion()) {
                done();
                return;
            }
            tween = gsap.to(el, {
                opacity: 0,
                scale: 0.97,
                duration: 0.15,
                ease: 'power3.in',
                onComplete: () => {
                    tween = null;
                    done();
                }
            });
        },
        closed: () => onClose?.()
    });

    $effect(() => dialog.sync());

    /*
     * `m-auto` is load-bearing: a <dialog> opened with showModal() is centred by the UA's
     * own `margin: auto`, and Tailwind preflight's `margin: 0` reset kills exactly that —
     * without this the dialog renders flush against the top-left corner in every consumer.
     */
    const classes = $derived(twMerge('m-auto rounded-fc-lg border border-fc-border bg-fc-component text-fc-fg p-0 w-[calc(100%-2rem)] max-h-[calc(100dvh-4rem)] overflow-auto backdrop:bg-fc-scrim', sizes[size], className));
</script>

<dialog
    bind:this={dialogEl}
    aria-labelledby={labelledBy}
    class={classes}
    {...rest}
    {...dialog.handlers}
>
    <div class="flex flex-col gap-3 p-5">
        {#if header || title || (showClose && dismissible)}
            <div class="flex items-start justify-between gap-3">
                <div class="min-w-0 flex-1">
                    {#if header}
                        {@render header()}
                    {:else if title}
                        <h2 id={headingId} class="text-fc-lg font-semibold">{title}</h2>
                    {/if}
                </div>
                {#if showClose && dismissible}
                    <button
                        type="button"
                        aria-label="Close"
                        onclick={() => (open = false)}
                        class="-mt-2 -mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-fc-pill text-fc-fg-muted transition-colors hover:bg-fc-surface hover:text-fc-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring"
                    >
                        <iconify-icon icon="mdi:close" width="18" height="18" class="block"></iconify-icon>
                    </button>
                {/if}
            </div>
        {/if}
        {@render children()}
        {#if footer}
            <div class="mt-1">{@render footer()}</div>
        {/if}
    </div>
</dialog>

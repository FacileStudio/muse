<script lang="ts">
    import type { Snippet } from 'svelte';
    import { gsap } from 'gsap';
    import { twMerge } from '../../utils/cn.js';
    import { prefersReducedMotion } from '../../utils/motion.js';

    type Size = 'sm' | 'md' | 'lg';

    let {
        open = $bindable(false),
        title,
        dismissible = true,
        showClose = false,
        size = 'md',
        onclose,
        header,
        footer,
        children,
        class: className = ''
    }: {
        open?: boolean;
        title?: string;
        dismissible?: boolean;
        showClose?: boolean;
        size?: Size;
        onclose?: () => void;
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

    let dialog: HTMLDialogElement | null = $state(null);
    let tween: ReturnType<typeof gsap.to> | null = null;
    let closing = false;

    function enter(el: HTMLDialogElement) {
        tween?.kill();
        tween = null;
        closing = false;
        const wasOpen = el.open;
        if (!wasOpen) el.showModal();
        if (prefersReducedMotion()) {
            gsap.set(el, { opacity: 1, scale: 1 });
            return;
        }
        if (!wasOpen) gsap.set(el, { opacity: 0, scale: 0.97 });
        tween = gsap.to(el, {
            opacity: 1,
            scale: 1,
            duration: 0.2,
            ease: 'power3.out',
            onComplete: () => (tween = null)
        });
    }

    function exit(el: HTMLDialogElement) {
        if (!el.open) return;
        tween?.kill();
        tween = null;
        if (prefersReducedMotion()) {
            el.close();
            return;
        }
        closing = true;
        tween = gsap.to(el, {
            opacity: 0,
            scale: 0.97,
            duration: 0.15,
            ease: 'power3.in',
            onComplete: () => {
                tween = null;
                if (!closing) return;
                closing = false;
                el.close();
            }
        });
    }

    $effect(() => {
        if (!dialog) return;
        if (open) enter(dialog);
        else exit(dialog);
    });

    function requestClose() {
        open = false;
    }

    function onDialogClose() {
        closing = false;
        open = false;
        onclose?.();
    }

    function onDialogCancel(event: Event) {
        event.preventDefault();
        if (!dismissible) return;
        requestClose();
    }

    function onDialogClick(event: MouseEvent) {
        if (!dismissible || !dialog) return;
        if (event.target !== dialog) return;
        const box = dialog.getBoundingClientRect();
        const inside =
            event.clientX >= box.left &&
            event.clientX <= box.right &&
            event.clientY >= box.top &&
            event.clientY <= box.bottom;
        if (!inside) requestClose();
    }

    /*
     * `m-auto` is load-bearing: a <dialog> opened with showModal() is centred by the UA's
     * own `margin: auto`, and Tailwind preflight's `margin: 0` reset kills exactly that —
     * without this the dialog renders flush against the top-left corner in every consumer.
     */
    const classes = $derived(twMerge('m-auto rounded-fc-lg border border-fc-border bg-fc-component text-fc-fg p-0 w-[calc(100%-2rem)] max-h-[calc(100dvh-4rem)] overflow-auto backdrop:bg-black/50', sizes[size], className));
</script>

<dialog
    bind:this={dialog}
    onclose={onDialogClose}
    oncancel={onDialogCancel}
    onclick={onDialogClick}
    class={classes}
>
    <div class="flex flex-col gap-3 p-5">
        {#if header || title || (showClose && dismissible)}
            <div class="flex items-start justify-between gap-3">
                <div class="min-w-0 flex-1">
                    {#if header}
                        {@render header()}
                    {:else if title}
                        <h2 class="text-fc-lg font-semibold">{title}</h2>
                    {/if}
                </div>
                {#if showClose && dismissible}
                    <button
                        type="button"
                        aria-label="Close"
                        onclick={requestClose}
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

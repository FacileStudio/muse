<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLDialogAttributes } from 'svelte/elements';

    export interface DrawerProps extends HTMLDialogAttributes {
        open?: boolean;
        title?: string;
        description?: string;
        children: Snippet;
        footer?: Snippet;
        showHandle?: boolean;
        showClose?: boolean;
        dismissible?: boolean;
        onClose?: () => void;
        class?: string;

    }
</script>

<script lang="ts">
    import { gsap } from 'gsap';
    import { twMerge } from '../../utils/cn.js';
    import { createDialog } from '../../utils/dialog.js';
    import { prefersReducedMotion } from '../../utils/motion.js';
    import IconButton from '../atoms/IconButton.svelte';

    let {
        open = $bindable(false),
        title,
        description,
        children,
        footer,
        showHandle = true,
        showClose = false,
        dismissible = true,
        onClose,
        class: className = '',
        ...rest
    }: DrawerProps = $props();

    const titleId = $props.id();

    let dialogEl: HTMLDialogElement | null = $state(null);
    let panel: HTMLDivElement | null = $state(null);

    let tween: ReturnType<typeof gsap.to> | null = null;
    let dragging = false;
    let pointer = -1;
    let startY = 0;
    let offset = 0;
    let prevY = 0;
    let prevTime = 0;
    let velocity = 0;

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
        surface: () => panel,
        enter() {
            tween?.kill();
            tween = null;
            if (!panel) return;
            if (prefersReducedMotion()) {
                gsap.set(panel, { y: 0 });
                return;
            }
            tween = gsap.fromTo(panel, { y: '100%' }, { y: 0, duration: 0.35, ease: 'power3.out' });
        },
        exit(_el, done) {
            tween?.kill();
            tween = null;
            if (!panel || prefersReducedMotion()) {
                done();
                return;
            }
            tween = gsap.to(panel, {
                y: '100%',
                duration: 0.25,
                ease: 'power3.in',
                onComplete: done
            });
        },
        closed() {
            dragging = false;
            tween?.kill();
            tween = null;
            if (panel) gsap.set(panel, { y: 0 });
            onClose?.();
        }
    });

    $effect(() => dialog.sync());

    function dismiss() {
        if (!dismissible) return;
        open = false;
    }

    /*
     * Reduced motion asks for no *animation*, not for no interaction — the sheet still
     * drags, only the spring back to rest snaps instead of tweening.
     */
    function settle(y: number) {
        if (!panel) return;
        if (prefersReducedMotion()) {
            gsap.set(panel, { y });
            return;
        }
        tween = gsap.to(panel, { y, duration: 0.3, ease: 'power3.out' });
    }

    function onPointerDown(e: PointerEvent) {
        if (!dismissible || !panel || dragging || e.button > 0) return;
        if ((e.target as HTMLElement | null)?.closest('button, a, input, select, textarea')) return;
        tween?.kill();
        tween = null;
        dragging = true;
        pointer = e.pointerId;
        startY = e.clientY;
        offset = 0;
        prevY = e.clientY;
        prevTime = e.timeStamp;
        velocity = 0;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }

    function onPointerMove(e: PointerEvent) {
        if (!dragging || e.pointerId !== pointer || !panel) return;
        const dt = e.timeStamp - prevTime;
        if (dt > 0) {
            velocity = (e.clientY - prevY) / dt;
            prevY = e.clientY;
            prevTime = e.timeStamp;
        }
        offset = Math.max(0, e.clientY - startY);
        gsap.set(panel, { y: offset });
    }

    function endDrag(e: PointerEvent, allowDismiss: boolean) {
        if (!dragging || e.pointerId !== pointer) return;
        dragging = false;
        pointer = -1;
        const strip = e.currentTarget as HTMLElement;
        if (strip.hasPointerCapture(e.pointerId)) strip.releasePointerCapture(e.pointerId);
        if (!panel) return;
        if (e.timeStamp - prevTime > 100) velocity = 0;
        const height = panel.getBoundingClientRect().height || 1;
        if (allowDismiss && (offset > height * 0.25 || velocity > 0.5)) {
            dismiss();
            return;
        }
        settle(0);
    }

    const hasHeader = $derived(Boolean(title || description || showClose));

    /*
     * `mt-auto mb-0 mx-auto` is load-bearing, same trap as Modal: the UA centres a modal
     * <dialog> with its own `margin: auto`, which Tailwind preflight's `margin: 0` reset
     * kills. `w-full max-w-none` is equally load-bearing — it defeats the UA's
     * `width: fit-content` and `max-width: calc(100% - 6px - 2em)` on modal dialogs.
     */
    const dialogClasses = $derived(
        twMerge(
            'mx-auto mt-auto mb-0 max-h-[85dvh] w-full max-w-none bg-transparent p-0 text-fc-fg sm:max-w-fc-sm backdrop:bg-fc-scrim',
            className
        )
    );

    const stripClasses = $derived(
        twMerge(
            'shrink-0 select-none',
            dismissible ? 'cursor-grab active:cursor-grabbing' : ''
        )
    );

    const headerClasses = $derived(
        twMerge('flex items-start gap-3 px-5 pb-4', showHandle ? 'pt-0' : 'pt-5')
    );

    const bodyClasses = $derived(
        twMerge(
            'min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5 text-fc-sm',
            hasHeader || showHandle ? 'pt-0' : 'pt-5',
            footer ? '' : 'pb-[max(1.25rem,env(safe-area-inset-bottom))]'
        )
    );
</script>

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
<dialog
    bind:this={dialogEl}
    class={dialogClasses}
    aria-labelledby={title ? titleId : undefined}
    {...rest}
    {...dialog.handlers}
>
    <div
        bind:this={panel}
        class="relative flex max-h-[85dvh] w-full flex-col overflow-hidden rounded-t-fc-lg border-x border-t border-fc-border bg-fc-component shadow-lg"
    >
        <div
            role="presentation"
            class={stripClasses}
            style:touch-action={dismissible ? 'none' : undefined}
            onpointerdown={onPointerDown}
            onpointermove={onPointerMove}
            onpointerup={(e) => endDrag(e, true)}
            onpointercancel={(e) => endDrag(e, false)}
        >
            {#if showHandle}
                <div class="flex h-11 items-center justify-center" aria-hidden="true">
                    <div class="h-1 w-10 rounded-fc-pill bg-fc-border"></div>
                </div>
            {/if}

            {#if hasHeader}
                <div class={headerClasses}>
                    <div class="flex min-w-0 flex-1 flex-col gap-1">
                        {#if title}
                            <h2 id={titleId} class="text-fc-lg font-semibold">{title}</h2>
                        {/if}
                        {#if description}
                            <p class="text-fc-sm text-fc-fg-muted">{description}</p>
                        {/if}
                    </div>
                    {#if showClose}
                        <IconButton
                            aria-label="Close"
                            class="-mr-1 border-0 text-fc-fg-muted hover:text-fc-fg"
                            onclick={() => (open = false)}
                        >
                            <iconify-icon icon="mdi:close" width="18" height="18" class="block"></iconify-icon>
                        </IconButton>
                    {/if}
                </div>
            {/if}
        </div>

        <div class={bodyClasses}>
            {@render children()}
        </div>

        {#if footer}
            <div
                class="shrink-0 border-t border-fc-border px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
            >
                {@render footer()}
            </div>
        {/if}
    </div>
</dialog>

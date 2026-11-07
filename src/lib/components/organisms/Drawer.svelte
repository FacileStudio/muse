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
    import { getI18n } from '../../i18n/context.svelte.js';
    import Icon from '../atoms/Icon.svelte';
    import { createDialog } from '../../utils/dialog.js';
    import { SheetDrag } from '../../utils/sheet-drag.js';
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

    const i18n = getI18n();

    const titleId = $props.id();

    let dialogEl: HTMLDialogElement | null = $state(null);
    let panel: HTMLDivElement | null = $state(null);

    let tween: ReturnType<typeof gsap.to> | null = null;
    const drag = new SheetDrag();

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
            drag.active = false;
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

    function settle(y: number) {
        if (!panel) return;
        if (prefersReducedMotion()) {
            gsap.set(panel, { y });
            return;
        }
        tween = gsap.to(panel, { y, duration: 0.3, ease: 'power3.out' });
    }

    function onPointerDown(e: PointerEvent) {
        if (!dismissible || !panel || drag.active || e.button > 0) return;
        if ((e.target as HTMLElement | null)?.closest('button, a, input, select, textarea')) return;
        tween?.kill();
        tween = null;
        drag.begin(e.pointerId, e.clientY, e.timeStamp);
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }

    function onPointerMove(e: PointerEvent) {
        if (!drag.active || e.pointerId !== drag.pointer || !panel) return;
        gsap.set(panel, { y: drag.move(e.clientY, e.timeStamp) });
    }

    function endDrag(e: PointerEvent, allowDismiss: boolean) {
        if (!drag.active || e.pointerId !== drag.pointer) return;
        const strip = e.currentTarget as HTMLElement;
        if (strip.hasPointerCapture(e.pointerId)) strip.releasePointerCapture(e.pointerId);
        const height = panel?.getBoundingClientRect().height || 1;
        const release = drag.end(e.timeStamp, height);
        if (!panel) return;
        if (allowDismiss && release) dismiss();
        else settle(0);
    }

    const hasHeader = $derived(Boolean(title || description || showClose));

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

<!--
@component
Une feuille qui monte du bas, refermable au glissement. Pour un panneau de bureau, c'est une `Modal`.
-->

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
        class="relative flex max-h-[85dvh] w-full flex-col overflow-hidden rounded-t-fc-lg bg-fc-component shadow-lg"
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
                    <div class="h-1 w-10 rounded-fc-pill bg-fc-fg-muted/40"></div>
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
                            aria-label={i18n.t('dialog.close')}
                            class="-mr-1 border-0 text-fc-fg-muted hover:text-fc-fg"
                            onclick={() => (open = false)}
                        >
                            <Icon icon="mdi:close" size={18} />
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
                class="shrink-0 px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
            >
                {@render footer()}
            </div>
        {/if}
    </div>
</dialog>

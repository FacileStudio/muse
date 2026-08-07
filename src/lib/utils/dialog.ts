import { onDestroy } from 'svelte';

/*
 * Body scroll lock, refcounted at module scope.
 *
 * `showModal()` buys the top layer, a focus trap, Escape and focus restore — it does
 * *not* stop the page behind the backdrop from scrolling, which on a phone means
 * dragging the dim area scrolls the content under the sheet. The counter exists so a
 * drawer opened from inside a modal cannot unlock the body when only the inner one
 * closes. No scrollbar-width compensation: this library hides scrollbars globally, so
 * there is no gutter to collapse and nothing to shift sideways.
 */
let lockDepth = 0;
let restoreOverflow = '';

function acquireScrollLock() {
    if (typeof document === 'undefined') return;
    if (lockDepth++ > 0) return;
    restoreOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
}

function releaseScrollLock() {
    if (typeof document === 'undefined') return;
    if (lockDepth === 0 || --lockDepth > 0) return;
    document.body.style.overflow = restoreOverflow;
    restoreOverflow = '';
}

export type DialogOptions = {
    /** The `<dialog>` bound with `bind:this`. Read inside the caller's effect. */
    element: () => HTMLDialogElement | null;
    /** The caller's bindable `open`. Read inside the caller's effect. */
    open: () => boolean;
    /** Flips the caller's bindable `open`. */
    setOpen: (value: boolean) => void;
    /** Whether Escape and a backdrop click may dismiss. Read at event time. */
    dismissible?: () => boolean;
    /** Element the backdrop hit-test treats as the content. Defaults to the `<dialog>`. */
    surface?: () => HTMLElement | null;
    /**
     * Play the open animation. `fresh` is true only when this call is what put the
     * dialog in the top layer, so a component can seed its from-state exactly once
     * instead of re-seeding it when an in-flight close is reversed.
     */
    enter?: (element: HTMLDialogElement, fresh: boolean) => void;
    /**
     * Play the close animation, then call `done()`. Calling it synchronously is fine —
     * that is the reduced-motion path. `done()` is a no-op if the dialog closed by some
     * other route meanwhile, so a tween landing late cannot re-close a reopened dialog.
     */
    exit?: (element: HTMLDialogElement, done: () => void) => void;
    /** Fired after the native `close` event, once `open` has been reset. */
    closed?: () => void;
};

/** Handlers to spread straight onto the `<dialog>`. */
export type DialogHandlers = {
    onclose: () => void;
    oncancel: (event: Event) => void;
    onclick: (event: MouseEvent) => void;
};

export type Dialog = {
    handlers: DialogHandlers;
    /**
     * Drives `showModal()`/`close()` from `open`. Call it from a component `$effect`:
     * the reactive reads have to happen in the component, because runes do not run in
     * a plain `.ts` module.
     */
    sync: () => void;
};

/**
 * The dialog controller shared by `Modal` and `Drawer`: open/close sync with
 * `showModal()`/`close()`, the closing latch that lets an exit animation own the
 * actual close, Escape handling gated on `dismissible`, the backdrop hit-test and
 * the body scroll lock.
 *
 * Animation deliberately stays in the components — a modal scales and a drawer
 * translates, on different durations and curves, and that is not duplication. They
 * hand their tweens in through `enter`/`exit`.
 *
 * Call this during component initialisation: it releases the scroll lock on destroy,
 * so a component unmounted while open cannot leave the page unscrollable.
 */
export function createDialog(options: DialogOptions): Dialog {
    let closing = false;
    let locked = false;

    function lock() {
        if (locked) return;
        locked = true;
        acquireScrollLock();
    }

    function unlock() {
        if (!locked) return;
        locked = false;
        releaseScrollLock();
    }

    function isDismissible() {
        return options.dismissible?.() ?? true;
    }

    function show(element: HTMLDialogElement) {
        closing = false;
        const fresh = !element.open;
        if (fresh) {
            element.showModal();
            lock();
        }
        options.enter?.(element, fresh);
    }

    function hide(element: HTMLDialogElement) {
        if (!element.open) return;
        if (!options.exit) {
            element.close();
            return;
        }
        closing = true;
        options.exit(element, () => {
            if (!closing) return;
            closing = false;
            element.close();
        });
    }

    onDestroy(unlock);

    return {
        sync() {
            const element = options.element();
            const open = options.open();
            if (!element) return;
            if (open) show(element);
            else hide(element);
        },

        handlers: {
            onclose() {
                closing = false;
                unlock();
                options.setOpen(false);
                options.closed?.();
            },

            oncancel(event: Event) {
                /* Escape fires `cancel` before closing. Preventing the default keeps the
                   exit animation in charge of the close, and is also the only reason
                   `dismissible: false` can hold. */
                event.preventDefault();
                if (!isDismissible()) return;
                options.setOpen(false);
            },

            onclick(event: MouseEvent) {
                if (!isDismissible()) return;
                /* A keyboard-activated button inside the dialog dispatches a click with
                   `detail === 0` and client coordinates of 0,0 — outside every rect, so
                   without this guard it reads as a backdrop click and closes the dialog. */
                if (event.detail === 0) return;
                const element = options.element();
                /* Clicks on the ::backdrop are attributed to the <dialog> itself; anything
                   landing on content reports that content as the target. */
                if (!element || event.target !== element) return;
                const surface = options.surface?.() ?? element;
                if (!surface) return;
                const box = surface.getBoundingClientRect();
                const inside =
                    event.clientX >= box.left &&
                    event.clientX <= box.right &&
                    event.clientY >= box.top &&
                    event.clientY <= box.bottom;
                if (!inside) options.setOpen(false);
            }
        }
    };
}

import { untrack } from 'svelte';

export type ToastTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export type ToastAction = { label: string; onClick: () => void };

export type ToastOptions = {
    tone?: ToastTone;
    title?: string;
    /** Milliseconds on screen. `0` pins the toast until something dismisses it. */
    duration?: number;
    /** Overrides the tone's icon; `null` drops the badge entirely. */
    icon?: string | null;
    /** One button, right of the message. Dismissing is the close button's job, not this one's. */
    action?: ToastAction;
    onDismiss?: () => void;
};

export type ToastItem = ToastOptions & {
    id: string;
    message: string;
    tone: ToastTone;
    duration: number;
};

/**
 * Four at once: past that the stack covers the thing the user is looking at, and nobody
 * reads the fifth anyway. A new toast pushes the oldest out rather than being dropped —
 * the most recent feedback is the one that matches what was just clicked.
 */
const LIMIT = 4;
const DEFAULT_DURATION = 5000;

type Timer = { handle: ReturnType<typeof setTimeout> | null; left: number; since: number };

let items = $state<ToastItem[]>([]);
const timers = new Map<string, Timer>();
let seq = 0;

/*
 * The countdown is stored as remaining milliseconds rather than a deadline so hovering can
 * freeze it: a toast that vanishes mid-sentence, or while the pointer is on its way to the
 * undo button, is worse than no toast at all.
 */
function pause(id: string): void {
    const timer = timers.get(id);
    if (!timer?.handle) return;
    clearTimeout(timer.handle);
    timer.handle = null;
    timer.left = Math.max(0, timer.left - (Date.now() - timer.since));
}

function resume(id: string): void {
    const timer = timers.get(id);
    if (!timer || timer.handle || timer.left <= 0) return;
    timer.since = Date.now();
    timer.handle = setTimeout(() => dismiss(id), timer.left);
}

/*
 * Every mutator reads the queue, and `untrack` is what keeps that read from becoming a
 * dependency: `$effect(() => { if (error) toast.danger(...) })` is the obvious way to raise
 * a toast from state, and without this the write inside `show` re-runs the effect that
 * called it — an infinite loop that only stops because LIMIT throws the oldest away.
 */
function dismiss(id: string): void {
    untrack(() => {
        const item = items.find((t) => t.id === id);
        if (!item) return;
        pause(id);
        timers.delete(id);
        items = items.filter((t) => t.id !== id);
        item.onDismiss?.();
    });
}

function clear(): void {
    for (const item of untrack(() => [...items])) dismiss(item.id);
}

function show(message: string, options: ToastOptions = {}): string {
    return untrack(() => {
        while (items.length >= LIMIT) dismiss(items[0].id);
        const item: ToastItem = {
            ...options,
            id: `fc-toast-${++seq}`,
            message,
            tone: options.tone ?? 'neutral',
            duration: options.duration ?? DEFAULT_DURATION
        };
        items = [...items, item];
        if (item.duration > 0) {
            timers.set(item.id, { handle: null, left: item.duration, since: 0 });
            resume(item.id);
        }
        return item.id;
    });
}

const toned =
    (tone: ToastTone) =>
    (message: string, options: ToastOptions = {}): string =>
        show(message, { ...options, tone });

/**
 * The queue behind `Toaster`. Read `items` to render your own, and call `pause`/`resume`
 * around hover and focus if you do.
 */
export const toasts = {
    get items(): ToastItem[] {
        return items;
    },
    pause,
    resume
};

/**
 * Fire-and-forget feedback, callable from anywhere — a plain module, an event handler, a
 * `catch` block. Requires a single `<Toaster />` mounted in the root layout.
 *
 * The sugar is named after the tone vocabulary (`danger`, not `error`) so a toast, a
 * `Badge` and an `Alert` describing the same event all spell it the same way.
 */
export const toast = {
    show,
    neutral: toned('neutral'),
    info: toned('info'),
    success: toned('success'),
    warning: toned('warning'),
    danger: toned('danger'),
    dismiss,
    clear
};

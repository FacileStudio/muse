/** Milliseconds a pointer rests on a control before its tooltip opens. */
export const TOOLTIP_DELAY = 300;

/** Milliseconds after a tooltip closes during which the next one opens with no delay. */
export const TOOLTIP_SKIP = 500;

/** Milliseconds a tooltip stays after the pointer leaves, so the pointer can reach it. */
export const TOOLTIP_GRACE = 100;

/**
 * The page-wide tooltip state: at most one tooltip open, and a warm window after one closes.
 * While a tooltip is open, or for `skip` ms after the last one closed, the next opens at once,
 * so moving along a toolbar reads every label with no wait.
 */
export class TooltipGroup {
    #close: (() => void) | null = null;
    #closedAt = Number.NEGATIVE_INFINITY;
    readonly #skip: number;
    readonly #now: () => number;

    constructor(skip = TOOLTIP_SKIP, now: () => number = () => performance.now()) {
        this.#skip = skip;
        this.#now = now;
    }

    /** The wait before opening: `delay` when cold, 0 while warm. */
    delayFor(delay: number): number {
        return this.#close || this.#now() - this.#closedAt < this.#skip ? 0 : delay;
    }

    /** Records `close` as the open tooltip, closing any other first. */
    opened(close: () => void): void {
        const previous = this.#close;
        if (previous && previous !== close) previous();
        this.#close = close;
    }

    /** Records that the tooltip behind `close` has closed, which starts the warm window. */
    closed(close: () => void): void {
        if (this.#close !== close) return;
        this.#close = null;
        this.#closedAt = this.#now();
    }
}

/** The one group every muse `Tooltip` joins. */
export const tooltips = new TooltipGroup();

/**
 * The text an `IconButton` shows: its own `tooltip` when it is a string, else its `aria-label`.
 * `false` opts out, and a button with neither has nothing to show.
 */
export function iconTooltip(tooltip: string | false | undefined, label: unknown): string | null {
    if (tooltip === false) return null;
    const text = (tooltip ?? (typeof label === 'string' ? label : '')).trim();
    return text || null;
}

/** Whether `text` adds anything to the accessible `name`; when the name already says it, the hint is not wired as a description. */
export function describes(text: string, name: unknown): boolean {
    if (typeof name !== 'string' || !name.trim()) return true;
    return !name.toLocaleLowerCase().includes(text.trim().toLocaleLowerCase());
}

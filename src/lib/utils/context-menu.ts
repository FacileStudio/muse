/** Where a context menu opens and when a gesture opens one. Pure, checked by `context-menu.test.ts`. */

export type PointInput = {
    x: number;
    y: number;
    width: number;
    height: number;
    viewportWidth: number;
    viewportHeight: number;
    margin: number;
};

export type Point = { left: number; top: number; maxHeight: number };

/**
 * Puts a menu of `width` by `height` with its top-left corner at the pointer. It flips left of the
 * pointer when it would overflow the right edge, flips above when it would overflow the bottom, and
 * is always clamped inside the viewport margins. `maxHeight` caps a menu taller than the viewport.
 */
export function placeAtPoint(input: PointInput): Point {
    const { x, y, width, height, viewportWidth, viewportHeight, margin } = input;
    const maxHeight = Math.max(0, viewportHeight - margin * 2);
    const shown = Math.min(height, maxHeight);
    const left = x + width + margin > viewportWidth ? x - width : x;
    const top = y + shown + margin > viewportHeight ? y - shown : y;
    return {
        left: clamp(left, margin, viewportWidth - width - margin),
        top: clamp(top, margin, viewportHeight - shown - margin),
        maxHeight
    };
}

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(value, Math.max(min, max)));
}

export type KeyOpenInput = { key: string; shiftKey?: boolean };

/** True for the two keyboard gestures that open a context menu: the ContextMenu key and Shift+F10. */
export function opensContextMenu(input: KeyOpenInput): boolean {
    return input.key === 'ContextMenu' || (input.key === 'F10' && Boolean(input.shiftKey));
}

/** Milliseconds a touch must rest before it opens the menu. */
export const LONG_PRESS_MS = 500;

/** Pixels a touch may drift before it counts as a scroll and cancels the long press. */
export const LONG_PRESS_SLOP = 10;

/** True when a touch moved far enough from where it started to be a scroll, not a press. */
export function driftedTooFar(startX: number, startY: number, x: number, y: number): boolean {
    return Math.hypot(x - startX, y - startY) > LONG_PRESS_SLOP;
}

/**
 * A touch held still for `LONG_PRESS_MS` fires `onpress` with where it started. Moving past the
 * slop, lifting the finger or a cancel stops it. Only touch pointers count; a mouse has a right button.
 */
export class LongPress {
    timer: ReturnType<typeof setTimeout> | undefined;
    x = 0;
    y = 0;

    start = (event: PointerEvent, onpress: (x: number, y: number, target: Element) => void): void => {
        this.cancel();
        if (event.pointerType !== 'touch') return;
        const { clientX, clientY } = event;
        const target = event.target as Element;
        this.x = clientX;
        this.y = clientY;
        this.timer = setTimeout(() => onpress(clientX, clientY, target), LONG_PRESS_MS);
    };

    move = (event: PointerEvent): void => {
        if (this.timer && driftedTooFar(this.x, this.y, event.clientX, event.clientY)) this.cancel();
    };

    cancel = (): void => {
        clearTimeout(this.timer);
        this.timer = undefined;
    };
}

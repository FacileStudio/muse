import { placeAcross, placePopup, type Align } from './placement.js';

export type AcrossHost = { width: () => number; align: () => Align | undefined };

const GAP = 6;
const MARGIN = 8;

/**
 * The geometry of a popup anchored to a trigger and drawn in the top layer with `position: fixed`.
 * `Select` and `Menu` share it. It measures the trigger, picks up or down, and hands the numbers to
 * the popup as inline styles.
 */
export class AnchoredPopup {
    open = $state(false);
    up = $state(false);
    maxHeight = $state(0);
    left = $state(0);
    right = $state(0);
    top = $state(0);
    bottom = $state(0);
    width = $state(0);
    need: number;
    anchor: () => HTMLElement | null;
    across: AcrossHost | undefined;

    constructor(anchor: () => HTMLElement | null, need: number, across?: AcrossHost) {
        this.anchor = anchor;
        this.need = need;
        this.across = across;
        this.maxHeight = need;
    }

    place = (): void => {
        const box = this.anchor()?.getBoundingClientRect();
        if (!box) return;
        const viewportHeight = window.innerHeight;
        const spot = placePopup({
            triggerTop: box.top,
            triggerBottom: box.bottom,
            viewportHeight,
            gap: GAP,
            margin: MARGIN,
            need: this.need
        });
        this.up = spot.up;
        this.maxHeight = spot.maxHeight;
        const viewportWidth = document.documentElement.clientWidth;
        this.left = this.across
            ? placeAcross({
                  triggerLeft: box.left,
                  triggerRight: box.right,
                  viewportWidth,
                  width: Math.max(this.across.width(), box.width),
                  margin: MARGIN,
                  align: this.across.align() ?? 'auto'
              }).left
            : box.left;
        this.right = viewportWidth - box.right;
        this.width = box.width;
        this.top = box.bottom + GAP;
        this.bottom = viewportHeight - box.top + GAP;
    };
}

/**
 * Listeners for an open popup: a press outside both the trigger and the popup closes it, and a
 * resize or any scroll re-measures it. Returns the cleanup for an `$effect`.
 */
export function watchPopup(inside: (target: Node) => boolean, close: () => void, place: () => void): () => void {
    const outside = (event: PointerEvent) => {
        if (!inside(event.target as Node)) close();
    };
    document.addEventListener('pointerdown', outside, true);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
        document.removeEventListener('pointerdown', outside, true);
        window.removeEventListener('resize', place);
        window.removeEventListener('scroll', place, true);
    };
}

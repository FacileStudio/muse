import { gsap } from 'gsap';
import { prefersReducedMotion } from './motion.js';

const PRESS_IN = { duration: 0.07, ease: 'power2.out' } as const;
const PRESS_OUT = { scale: 1, duration: 0.22, ease: 'power2.out' } as const;

/* How far each edge travels inward, in px, regardless of how big the element is. */
const DIP_PX = 1.5;
const MIN_SCALE = 0.93;
const MAX_SCALE = 0.997;

/**
 * A scale that moves every edge the same *distance*, not the same percentage.
 *
 * A fixed ratio is the wrong model for a component library, because the same action
 * lands on a 44px icon button and on an 868px-wide list row. At 0.97 the button's
 * edge travels under a pixel — imperceptible — while the row's travels thirteen, and
 * the row is the one that looked absurd. Solving for a constant pixel dip makes a
 * press feel like the same gesture on both.
 */
function adaptiveScale(node: HTMLElement): number {
    const width = node.offsetWidth;
    if (!width) return 0.97;
    return Math.min(MAX_SCALE, Math.max(MIN_SCALE, 1 - (DIP_PX * 2) / width));
}

/**
 * Press feedback for anything that behaves like a button.
 *
 * Lives here rather than inline in each component because the curve is the whole
 * point: every pressable surface in the library has to feel identical, and three
 * hand-copied gsap sequences drifted into two different scales the first time
 * this was inlined.
 *
 * The curve is deliberately restrained. It used to dip to 0.94 and return over
 * 0.5s on `elastic.out(1, 0.4)` — a full rubber-band overshoot. That reads as
 * playful on a 44px sidebar row and absurd the moment the same action lands on a
 * full-width list row, which is exactly what happened. A press is an
 * acknowledgement, not an event: it should be felt, not watched.
 *
 * The depth is measured per press rather than fixed, so the element's edges always
 * travel the same distance — see `adaptiveScale`. Pass an explicit `scale` to
 * override that, or `1` to opt out entirely while keeping the action attached.
 *
 * The tween is killed on destroy, so a component that unmounts mid-press does not
 * leave gsap animating a detached node.
 */
export function springPress(node: HTMLElement, scale?: number) {
    let depth = scale;

    const press = () => {
        if (prefersReducedMotion()) return;
        gsap.killTweensOf(node, 'scale');
        gsap.to(node, {
            ...PRESS_IN,
            scale: depth ?? adaptiveScale(node),
            onComplete: () => gsap.to(node, PRESS_OUT)
        });
    };

    node.addEventListener('pointerdown', press);

    return {
        update(next?: number) {
            depth = next;
        },
        destroy() {
            gsap.killTweensOf(node, 'scale');
            node.removeEventListener('pointerdown', press);
        }
    };
}

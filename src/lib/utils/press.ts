import { gsap } from 'gsap';
import { prefersReducedMotion } from './motion.js';

const PRESS_IN = { duration: 0.08, ease: 'power2.in' } as const;
const PRESS_OUT = { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' } as const;

/**
 * Press feedback for anything that behaves like a button.
 *
 * Lives here rather than inline in each component because the curve is the whole
 * point: every pressable surface in the library has to feel identical, and three
 * hand-copied gsap sequences drifted into two different scales the first time
 * this was inlined. Pass a scale only when the target is small enough that 0.94
 * reads as nothing — icon-only buttons want a deeper dip than a full nav row.
 *
 * The tween is killed on destroy, so a component that unmounts mid-press does not
 * leave gsap animating a detached node.
 */
export function springPress(node: HTMLElement, scale: number = 0.94) {
    let depth = scale;

    const press = () => {
        if (prefersReducedMotion()) return;
        gsap.killTweensOf(node, 'scale');
        gsap.to(node, {
            ...PRESS_IN,
            scale: depth,
            onComplete: () => gsap.to(node, PRESS_OUT)
        });
    };

    node.addEventListener('pointerdown', press);

    return {
        update(next: number = 0.94) {
            depth = next;
        },
        destroy() {
            gsap.killTweensOf(node, 'scale');
            node.removeEventListener('pointerdown', press);
        }
    };
}

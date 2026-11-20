import { gsap } from 'gsap';
import { prefersReducedMotion } from '../../utils/motion.js';
import { AREA_OPACITY, ENTRY_DURATION } from '../../utils/chart.js';

const EASE = 'power3.out';
const HOVER_DURATION = 0.25;
const DIMMED_OPACITY = 0.35;

/** Drives a 0→1 tween through a proxy object so runes state stays the single source of truth. */
export function tweenProgress(animate: boolean, set: (t: number) => void): void {
    if (!animate || prefersReducedMotion()) {
        set(1);
        return;
    }
    const proxy = { t: 0 };
    gsap.to(proxy, {
        t: 1,
        duration: ENTRY_DURATION,
        ease: EASE,
        onUpdate: () => set(proxy.t)
    });
}

/** Fades every `[data-mark]` but the active one; an active of -1 brings them all back. */
export function focusMarks(root: Element, active: number, animate: boolean): void {
    const marks = root.querySelectorAll<SVGElement>('[data-mark]');

    if (!marks.length)
        return;

    gsap.to(marks, {
        opacity: (_: number, mark: SVGElement) =>
            active < 0 || Number(mark.dataset.mark) === active ? 1 : DIMMED_OPACITY,
        duration: animate && !prefersReducedMotion() ? HOVER_DURATION : 0,
        ease: EASE,
        overwrite: 'auto'
    });
}

/** Slides freshly swapped text in from below, one element after the other. */
export function swapIn(root: Element, animate: boolean): void {
    if (!animate || prefersReducedMotion())
        return;

    const swapped = root.querySelectorAll('[data-swap]');

    if (!swapped.length)
        return;

    gsap.fromTo(
        swapped,
        {
            y: 8,
            opacity: 0
        },
        {
            y: 0,
            opacity: 1,
            duration: HOVER_DURATION,
            stagger: 0.04,
            ease: EASE,
            overwrite: true
        }
    );
}

/** Returns a setter that tweens a list of numbers towards its targets and reports each frame. */
export function valueTween(set: (values: number[]) => void): (targets: number[], animate: boolean) => void {
    const values: number[] = [];

    return (targets, animate) => {
        while (values.length < targets.length)
            values.push(0);

        gsap.to(values, {
            endArray: targets,
            duration: animate && !prefersReducedMotion() ? HOVER_DURATION : 0,
            ease: EASE,
            overwrite: true,
            onUpdate: () => set([...values])
        });
    };
}

/**
 * Dash-offset draw-in for `[data-line]`, with `[data-area]` fading to the shared area
 * opacity and `[data-fade]` to full. The inline dash properties are removed on complete
 * so a later re-render is not stuck with a stale stroke length.
 */
export function drawIn(svg: SVGSVGElement, animate: boolean): void {
    if (!animate || prefersReducedMotion()) return;
    for (const path of svg.querySelectorAll<SVGPathElement>('[data-line]')) {
        const len = path.getTotalLength();
        if (!len) continue;
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(path, {
            strokeDashoffset: 0,
            duration: ENTRY_DURATION,
            ease: EASE,
            onComplete: () => {
                path.style.removeProperty('stroke-dasharray');
                path.style.removeProperty('stroke-dashoffset');
            }
        });
    }
    const areas = svg.querySelectorAll<SVGElement>('[data-area]');
    if (areas.length) {
        gsap.fromTo(areas, { opacity: 0 }, { opacity: AREA_OPACITY, duration: ENTRY_DURATION, ease: EASE });
    }
    const fades = svg.querySelectorAll<SVGElement>('[data-fade]');
    if (fades.length) {
        gsap.fromTo(fades, { opacity: 0 }, { opacity: 1, duration: ENTRY_DURATION, ease: EASE });
    }
}

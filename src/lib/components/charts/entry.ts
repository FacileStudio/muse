import { gsap } from 'gsap';
import { prefersReducedMotion } from '../../utils/motion.js';
import { AREA_OPACITY, ENTRY_DURATION } from '../../utils/chart.js';

const EASE = 'power3.out';

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

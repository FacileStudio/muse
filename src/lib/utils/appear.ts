import { gsap } from 'gsap';
import { prefersReducedMotion } from './motion.js';

const STEP = 0.05;
const SPREAD = 0.6;
const OFFSET = 12;

let queue: HTMLElement[] = [];
let frame = 0;

function flush() {
    const batch = queue.filter((node) => node.isConnected);

    queue = [];
    frame = 0;
    batch.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));

    gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        // a long list shares the spread instead of growing past it
        stagger: Math.min(STEP, SPREAD / batch.length),
        clearProps: 'opacity,transform',
    });
}

/** Fades and lifts `node` in, staggered with everything else that mounted in the same frame. */
export function appear(node: HTMLElement) {
    if (prefersReducedMotion())
        return;

    // hidden before the first paint, so nothing flashes in place before it rises
    gsap.set(node, {
        opacity: 0,
        y: OFFSET,
    });
    queue.push(node);
    frame ||= requestAnimationFrame(flush);

    return {
        destroy: () => {
            gsap.killTweensOf(node);
        },
    };
}

export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

/**
 * The element that actually scrolls `node`, or `undefined` when that is the window.
 *
 * Scroll-driven animation defaults to listening on the window, and in the suite's standard
 * shell that is simply the wrong element: the page lives inside a `<main class="overflow-auto">`
 * next to a fixed sidebar, the window never scrolls, and scroll events do not bubble out of
 * the container. A component that assumes the window sits at progress 0 forever and looks
 * like it is broken. Feed the result to ScrollTrigger's `scroller`.
 */
export function scrollParent(node: Element | null): HTMLElement | undefined {
  if (typeof window === 'undefined' || !node) return undefined;
  let current = node.parentElement;
  while (current && current !== document.body && current !== document.documentElement) {
    const { overflowY } = getComputedStyle(current);
    if (overflowY === 'auto' || overflowY === 'scroll') return current;
    current = current.parentElement;
  }
  return undefined;
}

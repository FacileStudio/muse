import { quartIn, quartOut } from 'svelte/easing';

export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

/** True below 640px, where `Modal` renders as a bottom sheet. False without a window (SSR). */
export const isSheet = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 640;
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

export type PopupMotion = { direction?: 'in' | 'out'; y?: number };

/**
 * The enter and exit of a menu panel or a small control: a fade with a 4px rise and a slight
 * scale. In is 0.2s `quartOut`, out is 0.15s `quartIn`, the Modal timings on the `power3` curve.
 * Instant under reduced motion. Use as `in:popupMotion` and `out:popupMotion={{ direction: 'out' }}`;
 * `y` flips the rise for a panel that opens upward.
 */
export function popupMotion(_node: Element, { direction = 'in', y = -4 }: PopupMotion = {}) {
  const leaving = direction === 'out';
  return {
    duration: prefersReducedMotion() ? 0 : leaving ? 150 : 200,
    easing: leaving ? quartIn : quartOut,
    css: (t: number) => `opacity: ${t}; transform: translateY(${(1 - t) * y}px) scale(${0.98 + 0.02 * t});`
  };
}

/** Calls `onChange` with whether `query` matches, now and on every change. Returns the cleanup, for an `$effect`. */
export function watchMedia(query: string, onChange: (matches: boolean) => void): () => void {
  const list = window.matchMedia(query);
  const sync = () => onChange(list.matches);
  sync();
  list.addEventListener('change', sync);
  return () => list.removeEventListener('change', sync);
}

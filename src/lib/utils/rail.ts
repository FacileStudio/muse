import { cubicInOut } from 'svelte/easing';
import { prefersReducedMotion } from './motion.js';
import { EDGE_FADE, type Axis } from './scroll-area.js';

export const RAIL_DURATION = 0.3;

const FALLBACK_WIDTH = { collapsed: 68, expanded: 220 };
const FADE_START = 0.45;

/** The rail's width in px for a state, read from the `--width-fc-nav-*` token with a fixed fallback. */
export function railWidth(el: HTMLElement, isCollapsed: boolean): number {
    const token = isCollapsed ? '--width-fc-nav-collapsed' : '--width-fc-nav-expanded';
    const fallback = isCollapsed ? FALLBACK_WIDTH.collapsed : FALLBACK_WIDTH.expanded;
    if (typeof window === 'undefined') return fallback;
    const parsed = Number.parseFloat(getComputedStyle(el).getPropertyValue(token));
    return Number.isFinite(parsed) ? parsed : fallback;
}

/** A Svelte transition that grows the space switcher in as the rail expands. */
export function switcherReveal(node: HTMLElement) {
    const height = node.offsetHeight;
    const marginTop = Number.parseFloat(getComputedStyle(node).marginTop) || 0;
    return {
        duration: prefersReducedMotion() ? 0 : RAIL_DURATION * 1000,
        easing: cubicInOut,
        css: (t: number, u: number) => {
            const fade = Math.max(0, (t - FADE_START) / (1 - FADE_START));
            return `overflow: hidden; height: ${t * height}px; margin-top: ${t * marginTop}px; opacity: ${fade}; transform: translateY(${-u * 8}px)`;
        }
    };
}

export type RailShortcuts = { onToggle?: () => void; onSearch?: () => void };

/** Mod+D toggles the rail and Mod+K opens search, each only when its handler is given. Returns the cleanup. */
export function watchRailShortcuts(shortcuts: RailShortcuts): () => void {
    const onKeydown = (e: KeyboardEvent) => {
        if (!(e.metaKey || e.ctrlKey) || e.altKey) return;
        const key = e.key.toLowerCase();
        const handler = key === 'd' ? shortcuts.onToggle : key === 'k' ? shortcuts.onSearch : undefined;
        if (!handler) return;
        e.preventDefault();
        handler();
    };
    document.addEventListener('keydown', onKeydown);
    return () => document.removeEventListener('keydown', onKeydown);
}

export type Span = { top: number; bottom: number };

const REVEAL_GAP = 8;

/**
 * The scrollTop that brings `item` fully inside `view`, or null when it is already visible.
 * Moves the least distance, like `scrollIntoView({ block: 'nearest' })`, plus a small gap.
 */
export function revealOffset(view: Span, item: Span, scrollTop: number, gap = REVEAL_GAP): number | null {
    const tall = item.bottom - item.top > view.bottom - view.top;
    if (item.top >= view.top && item.bottom <= view.bottom) return null;
    if (item.top < view.top || tall) return Math.max(0, scrollTop + item.top - view.top - gap);
    return scrollTop + item.bottom - view.bottom + gap;
}

/**
 * Scrolls `container`, and only it, so `item` is fully in view along `axis`. Never touches the
 * document, does nothing when the item is already visible or the DOM has no layout (jsdom),
 * and jumps instead of gliding when `smooth` is false or motion is reduced.
 */
export function revealChild(container: HTMLElement, item: HTMLElement, axis: Axis, smooth: boolean, gap = EDGE_FADE): void {
    if (typeof item.getBoundingClientRect !== 'function') return;
    const span = (r: Pick<DOMRect, 'top' | 'bottom' | 'left' | 'right'>): Span =>
        axis === 'x' ? { top: r.left, bottom: r.right } : { top: r.top, bottom: r.bottom };
    const from = axis === 'x' ? container.scrollLeft : container.scrollTop;
    const to = revealOffset(span(container.getBoundingClientRect()), span(item.getBoundingClientRect()), from, gap);
    if (to === null) return;
    const behavior = smooth && !prefersReducedMotion() ? 'smooth' : 'auto';
    if (typeof container.scrollTo === 'function') container.scrollTo(axis === 'x' ? { left: to, behavior } : { top: to, behavior });
    else if (axis === 'x') container.scrollLeft = to;
    else container.scrollTop = to;
}

/** Scrolls `container`, and only it, so its `aria-current="page"` link is in view. */
export function revealActive(container: HTMLElement, smooth: boolean): void {
    const item = container.querySelector<HTMLElement>('[aria-current="page"]');
    if (item) revealChild(container, item, 'y', smooth);
}

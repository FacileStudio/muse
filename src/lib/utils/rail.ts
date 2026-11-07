import { cubicInOut } from 'svelte/easing';
import { prefersReducedMotion } from './motion.js';

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

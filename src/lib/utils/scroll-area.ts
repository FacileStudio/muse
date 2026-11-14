export type Axis = 'x' | 'y';

/** The width of the fade a scroll area shows at an end that still hides content. */
export const EDGE_FADE = 24;

export type Edges = { start: boolean; end: boolean };

/** Which ends of a scroll area still hide content along `axis`. */
export function hiddenEdges(el: HTMLElement, axis: Axis): Edges {
    const pos = axis === 'x' ? Math.abs(el.scrollLeft) : el.scrollTop;
    const range = axis === 'x' ? el.scrollWidth - el.clientWidth : el.scrollHeight - el.clientHeight;
    return { start: pos > 1, end: range - pos > 1 };
}

/** The inline style that fades the hidden ends of a scroll area, or '' when nothing is hidden. */
export function edgeMask(edges: Edges, axis: Axis, size = EDGE_FADE): string {
    if (!edges.start && !edges.end) return '';
    const dir = axis === 'x' ? 'to right' : 'to bottom';
    const start = edges.start ? 'transparent' : 'black';
    const end = edges.end ? 'transparent' : 'black';
    const gradient = `linear-gradient(${dir}, ${start} 0, black ${size}px, black calc(100% - ${size}px), ${end} 100%)`;
    return `mask-image: ${gradient}; -webkit-mask-image: ${gradient}`;
}

export type ScrollAreaHandlers = {
    /** After the area or any direct child changes size, debounced. */
    onResize?: () => void;
    /** On every scroll, programmatic or not. */
    onScroll?: () => void;
    /** When a person scrolls the area by wheel, touch or keyboard. */
    onUser?: () => void;
};

const USER_SCROLL_EVENTS = ['wheel', 'touchmove', 'keydown'] as const;

/**
 * Watches a scroll area and its direct children. Returns the cleanup. Without
 * ResizeObserver (jsdom, SSR) it still reports scrolls and user input, never resizes.
 */
export function watchScrollArea(el: HTMLElement, handlers: ScrollAreaHandlers, wait = 100): () => void {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const user = () => handlers.onUser?.();
    const scroll = () => handlers.onScroll?.();
    for (const type of USER_SCROLL_EVENTS) el.addEventListener(type, user, { passive: true });
    el.addEventListener('scroll', scroll, { passive: true });
    const observer =
        typeof ResizeObserver === 'undefined'
            ? null
            : new ResizeObserver(() => {
                  clearTimeout(timer);
                  timer = setTimeout(() => handlers.onResize?.(), wait);
              });
    observer?.observe(el);
    for (const child of el.children) observer?.observe(child);
    return () => {
        clearTimeout(timer);
        observer?.disconnect();
        for (const type of USER_SCROLL_EVENTS) el.removeEventListener(type, user);
        el.removeEventListener('scroll', scroll);
    };
}

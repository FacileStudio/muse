export function resize(node: HTMLElement, cb: (w: number) => void): { destroy(): void } {
    if (typeof ResizeObserver === 'undefined') {
        return { destroy() {} };
    }
    const observer = new ResizeObserver((entries) => {
        for (const entry of entries) cb(entry.contentRect.width);
    });
    observer.observe(node);
    cb(node.clientWidth);
    return {
        destroy() {
            observer.disconnect();
        }
    };
}

export type PageItem = number | 'gap';

/**
 * The page numbers to show: the first, the last, the current page and `siblings` on each side, with
 * `'gap'` standing in for a skipped run. A run of exactly one page is shown rather than hidden behind
 * a gap, so the control never has a gap that saves no room.
 */
export function pageRange(page: number, count: number, siblings = 1): PageItem[] {
    if (count < 1) return [];
    if (count <= siblings * 2 + 5) return Array.from({ length: count }, (_, i) => i + 1);
    const current = Math.min(Math.max(1, Math.round(page)), count);
    const wanted = new Set([1, count]);
    for (let n = current - siblings; n <= current + siblings; n++) if (n >= 1 && n <= count) wanted.add(n);
    const pages = [...wanted].sort((a, b) => a - b);
    const out: PageItem[] = [];
    pages.forEach((n, i) => {
        const before = pages[i - 1];
        if (before !== undefined && n - before === 2) out.push(before + 1);
        else if (before !== undefined && n - before > 2) out.push('gap');
        out.push(n);
    });
    return out;
}

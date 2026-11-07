export const THEMES = ['system', 'light', 'dark'] as const;

export type Theme = (typeof THEMES)[number];

/** Narrows any string to a theme name. */
export function isTheme(value: unknown): value is Theme {
    return typeof value === 'string' && (THEMES as readonly string[]).includes(value);
}

/** The theme the `<html>` classes describe: `.dark`, `.light`, or neither for the system setting. */
export function readTheme(root: Element = document.documentElement): Theme {
    if (root.classList.contains('dark')) return 'dark';
    return root.classList.contains('light') ? 'light' : 'system';
}

/** Writes both classes, and neither for `system`, which is what `tokens.css` keys its two dark blocks on. */
export function applyTheme(theme: Theme, root: Element = document.documentElement): void {
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');
}

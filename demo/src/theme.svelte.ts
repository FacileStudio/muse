export type ThemeMode = 'system' | 'light' | 'dark';

const KEY = 'muse-theme';

function stored(): ThemeMode {
    const raw = localStorage.getItem(KEY);
    return raw === 'light' || raw === 'dark' || raw === 'system' ? raw : 'system';
}

export const theme = $state({ mode: stored() });

/*
 * Both classes are written, and `system` writes neither. tokens.css flips on
 * `prefers-color-scheme` scoped to `:root:not(.light)`, so the `.light` class is the only
 * thing that lets someone force light on a dark OS — a script that only ever adds `.dark`
 * silently strands those users.
 */
export function setTheme(mode: ThemeMode) {
    theme.mode = mode;
    const root = document.documentElement;
    root.classList.toggle('dark', mode === 'dark');
    root.classList.toggle('light', mode === 'light');
    localStorage.setItem(KEY, mode);
}

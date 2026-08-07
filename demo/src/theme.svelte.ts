export type ThemeMode = 'system' | 'light' | 'dark';

const KEY = 'muse-theme';

/*
 * `typeof document === 'undefined'` is the guard, and the choice matters because this file
 * gets copied into apps. `typeof localStorage === 'undefined'` is the obvious spelling and it
 * is broken: recent Node defines a `localStorage` global, so the check passes on the server
 * and `getItem` throws anyway. A SvelteKit consumer should use `browser` from
 * `$app/environment`; `document` is the framework-free equivalent.
 */
const browser = typeof document !== 'undefined';

function stored(): ThemeMode {
    if (!browser) return 'system';
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

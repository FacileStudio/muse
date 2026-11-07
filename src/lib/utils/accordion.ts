import { moveActive, type MoveKey } from './listbox.js';

/** The open panel ids after toggling `id`. A single accordion keeps at most one open. */
export function toggleOpen(open: readonly string[], id: string, multiple: boolean): string[] {
    if (open.includes(id)) return open.filter((x) => x !== id);
    return multiple ? [...open, id] : [id];
}

const KEYS = new Set<string>(['ArrowDown', 'ArrowUp', 'Home', 'End']);

/** The header the focus moves to for a key, wrapping at the ends and skipping disabled ones. `-1` for an ignored key. */
export function headerForKey(disabled: boolean[], current: number, key: string): number {
    if (!KEYS.has(key)) return -1;
    return moveActive(disabled, current, key as MoveKey, true);
}

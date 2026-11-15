const EDITABLE = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

/** True when a key press should focus a search field: the shortcut key, bare, outside any editable target. */
export function wantsFocus(
    event: { key: string; ctrlKey: boolean; metaKey: boolean; altKey: boolean; defaultPrevented: boolean },
    target: { tagName?: string; isContentEditable?: boolean } | null,
    shortcut: string
): boolean {
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return false;
    if (event.key !== shortcut) return false;
    if (target && (EDITABLE.has(target.tagName ?? '') || target.isContentEditable)) return false;
    return true;
}

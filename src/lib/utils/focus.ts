const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** The first element inside `root` that Tab can reach, if any. */
export function firstFocusable(root: HTMLElement | null): HTMLElement | null {
    return root?.querySelector<HTMLElement>(FOCUSABLE) ?? null;
}

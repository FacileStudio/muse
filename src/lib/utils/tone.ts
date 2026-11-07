/** The one tone vocabulary of the suite: `Badge`, `StatusDot` and `Toast` take all eight. */
export type Tone = 'neutral' | 'accent' | 'info' | 'success' | 'warning' | 'danger' | 'owner' | 'admin';

/** The status subset: what `Alert` takes. */
export type StatusTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

/** The tinted fill and text colour of each tone. Accent is the inverted exception. */
export const toneFill: Record<Tone, string> = {
    neutral: 'bg-fc-surface text-fc-fg-muted',
    accent: 'bg-fc-accent text-fc-accent-fg',
    info: 'bg-fc-info/10 text-fc-info',
    success: 'bg-fc-success/10 text-fc-success',
    warning: 'bg-fc-warning/10 text-fc-warning',
    danger: 'bg-fc-danger/10 text-fc-danger',
    owner: 'bg-fc-owner/10 text-fc-owner',
    admin: 'bg-fc-admin/10 text-fc-admin'
};

/** Whether a tone earns an assertive live region: only what the user has to act on. */
export function isUrgent(tone: Tone): boolean {
    return tone === 'warning' || tone === 'danger';
}

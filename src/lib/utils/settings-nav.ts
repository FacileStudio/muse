export const CANONICAL_SECTIONS = ['profile', 'preferences', 'notifications', 'tokens', 'subscription', 'advanced'] as const;

export type SettingsRoute = { current: string; drilled: boolean; known: boolean };

const APP_RANK = CANONICAL_SECTIONS.indexOf('notifications') + 0.5;

function rank(id: string): number {
    const at = (CANONICAL_SECTIONS as readonly string[]).indexOf(id);
    return at < 0 ? APP_RANK : at;
}

/** The canonical order: Profile, Preferences, Notifications, the app's own sections, API tokens, Subscription, Advanced. Stable for ties. */
export function orderSections<T extends { id: string }>(sections: readonly T[]): T[] {
    return sections
        .map((section, at) => ({ section, at }))
        .sort((a, b) => rank(a.section.id) - rank(b.section.id) || a.at - b.at)
        .map(({ section }) => section);
}

/**
 * Which panel a requested section shows. On desktop `current` always has a panel; on a phone the
 * bare settings URL (`drilled: false`) shows the list and a named section drills into its panel.
 * `known: false` means the request matched nothing, so the caller can redirect.
 */
export function settingsRoute(requested: string | null | undefined, sections: readonly { id: string }[]): SettingsRoute {
    const first = sections[0]?.id ?? '';
    if (!requested) return { current: first, drilled: false, known: true };
    const hit = sections.find((section) => section.id === requested);
    return hit ? { current: hit.id, drilled: true, known: true } : { current: first, drilled: false, known: false };
}

/** The address of one section under a settings base path. */
export function sectionHref(base: string, id: string): string {
    return `${base.replace(/\/+$/, '')}/${id}`;
}

export const USER_COLORS = ['#AD9EF0', '#F09ED6', '#EE7E89', '#EEB47E', '#A9EE7E', '#7EEEDB'] as const;

export type UserColor = (typeof USER_COLORS)[number];

export const USER_COLOR_LABELS: Record<UserColor, string> = {
    '#AD9EF0': 'Purple',
    '#F09ED6': 'Pink',
    '#EE7E89': 'Red',
    '#EEB47E': 'Orange',
    '#A9EE7E': 'Green',
    '#7EEEDB': 'Aqua'
};

/** Coerces any stored value to a palette colour: trims, uppercases, adds a missing `#`, falls back to the first colour. */
export function normalizeUserColor(color: string | null | undefined): UserColor {
    const normalized = color?.trim().toUpperCase();
    if (!normalized) return USER_COLORS[0];
    const withHash = normalized.startsWith('#') ? normalized : `#${normalized}`;
    return (USER_COLORS as readonly string[]).includes(withHash) ? (withHash as UserColor) : USER_COLORS[0];
}

/** Human label for a colour, normalizing first so unknown values still resolve. */
export function userColorLabel(color: string | null | undefined): string {
    return USER_COLOR_LABELS[normalizeUserColor(color)];
}

/**
 * Parses any reasonable spelling of a hex colour to `#rrggbb`, or `null` if it is not one.
 *
 * Accepts `fff`, `#fff`, `FFF`, `#FFFFFF` — with or without the hash, in either case, and
 * with surrounding whitespace, because those are what a paste from a design tool actually
 * contains. Returns `null` rather than throwing or guessing: the caller is usually watching
 * someone type, and half a hex is not an error, it is an unfinished one.
 *
 * Output is lowercase to match what `<input type="color">` reports, so round-tripping a
 * colour through the OS picker does not churn the bound value.
 */
export function parseHex(input: string | null | undefined): string | null {
    const raw = input?.trim().replace(/^#/, '') ?? '';
    if (!/^(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(raw)) return null;
    const full = raw.length === 3 ? raw.replace(/./g, (c) => c + c) : raw;
    return `#${full.toLowerCase()}`;
}

import solar from '@iconify-json/solar/icons.json' with { type: 'json' };

/** SVG inner markup drawn in `currentColor`, with the size of the box it was drawn in. */
export interface Glyph {
    body: string;
    width: number;
    height: number;
}

/** The Facile "F." mark, from vitrine's static/favicon.svg. */
export const FACILE_GLYPH: Glyph = {
    width: 35,
    height: 37,
    body: '<path fill="currentColor" d="M3.45606 0.383982L3.74406 0.47998C3.12006 2.83198 4.46406 6.09598 6.72006 '
        + '6.09598C11.4241 6.09598 15.2161 -1.90735e-05 21.9361 0.0479803C27.2161 0.0479803 28.3681 4.75198 28.3681 '
        + '7.00798V10.416H21.0721L21.0241 7.48798C21.0241 4.12798 19.2481 3.35998 17.2321 3.35998C10.5121 3.35998 '
        + '7.96806 12.864 4.36806 12.864C2.35206 12.864 1.82406 10.08 1.82406 7.91998C1.82406 4.70398 2.64006 1.72798 '
        + '3.45606 0.383982ZM8.54406 17.52L13.1041 7.43998H19.3921C17.5681 10.944 16.0321 14.352 14.6401 17.52H15.1681C'
        + '20.7841 17.52 25.2481 18.912 25.2481 26.256L18.0481 26.16C18.0961 19.44 17.9041 18.288 15.2161 18.288H14.2561'
        + 'C9.69606 28.512 6.43206 36.048 6.25104e-05 36.048L0.0480625 28.176L0.0480625 17.52H8.54406ZM0.432063 '
        + '22.176L0.432063 28.176C2.92806 28.032 5.13606 25.152 6.52806 21.984L8.16006 18.336C1.96806 18.576 0.432063 '
        + '19.344 0.432063 22.176ZM28.1918 35.808L28.1918 29.952L34.0958 29.952V35.808H28.1918Z"/>'
};

/** Boutique's bag mark, from Boutique's BrandMark.svelte. */
export const BOUTIQUE_GLYPH: Glyph = {
    width: 24,
    height: 24,
    body: '<path fill="currentColor" d="M12 2a4.95 4.95 0 0 0-4.95 4.95V8.6h2V6.95a2.95 2.95 0 1 1 5.9 0V8.6h2V6.95A4.95 '
        + '4.95 0 0 0 12 2Z"/><path fill="currentColor" d="M6 8.6h12a2 2 0 0 1 1.98 1.7l1.4 8.9A2.4 2.4 0 0 1 19.01 '
        + '22H4.99a2.4 2.4 0 0 1-2.37-2.8l1.4-8.9A2 2 0 0 1 6 8.6Z"/>'
};

/** sonar's ping mark, from sonar's apps/client/static/favicon.svg, recoloured to `currentColor`. */
export const SONAR_GLYPH: Glyph = {
    width: 24,
    height: 24,
    body: '<g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 12 19 5"/>'
        + '<path d="M20.5 12A8.5 8.5 0 1 1 12 3.5" opacity=".5"/><path d="M16 12a4 4 0 1 1-4-4"/></g>'
        + '<circle cx="12" cy="12" r="1.8" fill="currentColor"/>'
};

/** Resolves a Solar name (`solar:<name>`) or a custom glyph to drawable markup. Throws on an unknown name. */
export function resolveGlyph(icon: string | Glyph): Glyph {
    if (typeof icon !== 'string') return icon;
    const [prefix, name] = icon.split(':');
    if (prefix !== 'solar' || !name) throw new Error(`${icon} is not a solar:<name> icon`);
    const entry = (solar.icons as Record<string, { body: string }>)[name];
    if (!entry) throw new Error(`${icon} is not in @iconify-json/solar`);
    return { body: entry.body, width: solar.width ?? 24, height: solar.height ?? 24 };
}

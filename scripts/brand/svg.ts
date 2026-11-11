import type { Glyph } from './glyphs.ts';

const FAVICON_STYLE = '<style>:root{color:#0a0a0a}@media (prefers-color-scheme:dark){:root{color:#fafafa}}</style>';

/** Escapes text for an SVG or HTML text node or attribute value. */
export function escapeXml(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function square(glyph: Glyph): { x: number; y: number; side: number } {
    const side = Math.max(glyph.width, glyph.height);
    return { x: (glyph.width - side) / 2, y: (glyph.height - side) / 2, side };
}

/** The tab favicon: the glyph on no background, dark on light chrome and light on dark chrome. */
export function faviconSvg(glyph: Glyph): string {
    const box = square(glyph);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box.x} ${box.y} ${box.side} ${box.side}">`
        + `${FAVICON_STYLE}${glyph.body}</svg>\n`;
}

/** The glyph in a fixed colour, fitted into a `size` square whose top-left corner is at `x`, `y`. */
export function placeGlyph(glyph: Glyph, at: { x: number; y: number; size: number }, color: string): string {
    const box = square(glyph);
    const scale = at.size / box.side;
    const body = glyph.body.replaceAll('currentColor', color);
    return `<g transform="translate(${at.x} ${at.y}) scale(${scale}) translate(${-box.x} ${-box.y})">${body}</g>`;
}

/** A square icon: the glyph at `ratio` of the canvas, centred, on `background` or on nothing. */
export function iconSvg(glyph: Glyph, canvas: number, look: { color: string; ratio: number; background?: string }): string {
    const size = canvas * look.ratio;
    const offset = (canvas - size) / 2;
    const plate = look.background ? `<rect width="${canvas}" height="${canvas}" fill="${look.background}"/>` : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas}" height="${canvas}" `
        + `viewBox="0 0 ${canvas} ${canvas}">${plate}${placeGlyph(glyph, { x: offset, y: offset, size }, look.color)}</svg>`;
}

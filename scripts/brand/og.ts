import type { SuiteApp } from './apps.ts';
import { FACILE_GLYPH, type Glyph } from './glyphs.ts';
import { measureText } from './raster.ts';
import { escapeXml, placeGlyph } from './svg.ts';

const WIDTH = 1200;
const HEIGHT = 630;
const MARGIN = 88;
const TEXT_WIDTH = WIDTH - MARGIN * 2;

const BACKDROP = '<defs><radialGradient id="lift" cx="0.12" cy="0" r="1.1">'
    + '<stop offset="0" stop-color="#1d1d1d"/><stop offset="0.55" stop-color="#0f0f0f"/>'
    + '<stop offset="1" stop-color="#0a0a0a"/></radialGradient>'
    + '<linearGradient id="fade" x1="0" y1="0" x2="1" y2="0.35">'
    + '<stop offset="0.6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient>'
    + `<mask id="watermark"><rect width="${WIDTH}" height="${HEIGHT}" fill="url(#fade)"/></mask></defs>`
    + `<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#lift)"/>`;

/** Splits `text` into greedy lines no wider than `width` at the given Inter size and weight. */
export function wrapText(text: string, font: { size: number; weight: number }, width: number): string[] {
    const lines: string[] = [];
    let line = '';
    for (const word of text.split(/\s+/)) {
        const candidate = line ? `${line} ${word}` : word;
        if (line && measureText(candidate, font.size, font.weight) > width) {
            lines.push(line);
            line = word;
        } else {
            line = candidate;
        }
    }
    return line ? [...lines, line] : lines;
}

function text(content: string, at: { x: number; y: number }, style: string, anchor = 'start'): string {
    return `<text x="${at.x}" y="${at.y}" text-anchor="${anchor}" font-family="Inter" ${style}>`
        + `${escapeXml(content)}</text>`;
}

function footer(app: SuiteApp): string {
    const domain = new URL(app.url).host;
    const studio = 'Facile Studio';
    const baseline = HEIGHT - 76;
    const studioWidth = measureText(studio, 24, 500);
    const markSize = 26;
    const markX = WIDTH - MARGIN - studioWidth - markSize - 12;
    return text(domain, { x: MARGIN, y: baseline }, 'font-size="24" font-weight="500" fill="#8a8a8a"')
        + placeGlyph(FACILE_GLYPH, { x: markX, y: baseline - 22, size: markSize }, '#8a8a8a')
        + text(studio, { x: WIDTH - MARGIN, y: baseline }, 'font-size="24" font-weight="500" fill="#8a8a8a"', 'end');
}

/** The 1200x630 link preview: glyph, name, title, description and a footer with the domain and the studio. */
export function ogSvg(app: SuiteApp, glyph: Glyph): string {
    const description = wrapText(app.description, { size: 30, weight: 400 }, TEXT_WIDTH - 140).slice(0, 3);
    const lines = description.map((line, index) =>
        text(line, { x: MARGIN, y: 398 + index * 42 }, 'font-size="30" font-weight="400" fill="#8f8f8f"'));
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">`
        + BACKDROP
        + `<g mask="url(#watermark)" opacity="0.07">${placeGlyph(glyph, { x: 760, y: -40, size: 520 }, '#fafafa')}</g>`
        + placeGlyph(glyph, { x: MARGIN, y: 80, size: 96 }, '#e5e5e5')
        + text(app.name, { x: MARGIN - 4, y: 280 }, 'font-size="84" font-weight="600" letter-spacing="-2.5" fill="#fafafa"')
        + text(app.title, { x: MARGIN, y: 338 }, 'font-size="38" font-weight="500" letter-spacing="-0.6" fill="#d4d4d4"')
        + lines.join('')
        + footer(app)
        + '</svg>';
}

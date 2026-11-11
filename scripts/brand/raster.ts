import { Resvg, type ResvgRenderOptions } from '@resvg/resvg-js';
import { join } from 'node:path';
import { escapeXml } from './svg.ts';

const FONTS = join(import.meta.dir, 'fonts');

const OPTIONS: ResvgRenderOptions = {
    font: {
        fontFiles: ['Inter-Regular.ttf', 'Inter-Medium.ttf', 'Inter-SemiBold.ttf'].map((file) => join(FONTS, file)),
        loadSystemFonts: false,
        defaultFontFamily: 'Inter'
    },
    shapeRendering: 2,
    textRendering: 1
};

/** Rasterises an SVG to a PNG `width` pixels wide, with the bundled Inter as the only font. */
export function renderPng(svg: string, width: number): Uint8Array {
    const resvg = new Resvg(svg, { ...OPTIONS, fitTo: { mode: 'width', value: width } });
    return resvg.render().asPng();
}

/** The rendered width in pixels of one line of Inter text at `size` and `weight`. */
export function measureText(text: string, size: number, weight: number): number {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="4000" height="400"><text x="0" y="200" `
        + `font-family="Inter" font-size="${size}" font-weight="${weight}">${escapeXml(text)}</text></svg>`;
    const box = new Resvg(svg, OPTIONS).getBBox();
    return box ? box.x + box.width : 0;
}

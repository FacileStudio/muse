/*
 * The favicon, generated from the same bundled glyph the rail draws — so the tab icon and the
 * logo cannot drift.
 *
 * No background plate: a favicon sits on browser chrome that is already a surface, and a filled
 * square reads as a sticker on it. Transparent means the glyph has to survive both a light and a
 * dark tab strip, which a single fill cannot do — so the colour comes from an embedded
 * `prefers-color-scheme` block. SVG favicons honour it in Chrome and Firefox; Safari falls back
 * to the default fill, which is the dark one and is correct on its light chrome.
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ICON_DATA } from '../../src/lib/icons-data.js';

const MARK = 'solar:pallete-2-bold-duotone';
const d = ICON_DATA[MARK];
if (!d) throw new Error(`${MARK} is not in the bundle — run scripts/build-icons.ts`);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${d.width} ${d.height}">
  <style>
    :root { color: #0a0a0a }
    @media (prefers-color-scheme: dark) { :root { color: #fafafa } }
  </style>
  ${d.body}
</svg>
`;

writeFileSync(join(import.meta.dir, '../static/favicon.svg'), svg);
console.log(`favicon written from ${MARK}, ${svg.length} bytes, transparent`);

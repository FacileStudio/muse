import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');

function block(selector: string): Record<string, string> {
    const start = css.indexOf(selector);
    if (start < 0) throw new Error(`no block for ${selector}`);
    const open = css.indexOf('{', start);
    const end = css.indexOf('}', open);
    const out: Record<string, string> = {};
    for (const line of css.slice(open + 1, end).split('\n')) {
        const match = line.match(/^\s*(--[\w-]+)\s*:\s*(.+?);\s*$/);
        if (match) out[match[1]] = match[2];
    }
    return out;
}

/*
 * The dark palette is written twice — once under `prefers-color-scheme` and once under an
 * explicit `.dark` class — because plain CSS cannot share a declaration block between a
 * media query and a class selector. A comment asking the next person to "edit both or
 * neither" is not a mechanism; this is.
 */
describe('dark mode blocks', () => {
    const media = block(':root:not(.light)');
    const explicit = block(':root.dark');

    test('define the same tokens', () => {
        expect(Object.keys(explicit).sort()).toEqual(Object.keys(media).sort());
    });

    test('define the same values', () => {
        expect(explicit).toEqual(media);
    });
});

/*
 * `color-scheme` is not a custom property, so `block()` above does not see it and the
 * "edit both or neither" test cannot cover it. It gets its own check, because it is the
 * one declaration that controls everything the *browser* paints — native select popups,
 * form internals, autofill, caret, the canvas past the page background — and losing it
 * looks exactly like "dark mode is broken" while every token is correct.
 */
describe('color-scheme', () => {
    function scheme(selector: string): string | undefined {
        const start = css.indexOf(selector);
        const open = css.indexOf('{', start);
        const end = css.indexOf('}', open);
        return css.slice(open + 1, end).match(/color-scheme\s*:\s*(\w+)\s*;/)?.[1];
    }

    test('the light default is declared on html', () => {
        expect(css.match(/html\s*\{[\s\S]*?color-scheme:\s*light;/)).not.toBeNull();
    });

    test('both dark blocks flip it', () => {
        expect(scheme(':root:not(.light)')).toBe('dark');
        expect(scheme(':root.dark')).toBe('dark');
    });
});

describe('token surface', () => {
    const light = block('@theme {');

    test('every dark token overrides a token declared in the light theme', () => {
        const declared = new Set(Object.keys(light));
        const chart = block('@theme static {');
        for (const key of Object.keys(chart)) declared.add(key);

        const orphans = Object.keys(block(':root.dark')).filter((key) => !declared.has(key));
        expect(orphans).toEqual([]);
    });

    test('semantic tokens that carry chroma are the only ones that do', () => {
        const chromatic = Object.entries(light)
            .filter(([key]) => key.startsWith('--color-'))
            .filter(([, value]) => {
                const match = value.match(/oklch\(\s*[\d.]+\s+([\d.]+)/);
                return match ? Number(match[1]) > 0 : false;
            })
            .map(([key]) => key.replace('--color-fc-', ''));

        expect(chromatic.sort()).toEqual(['admin', 'danger', 'info', 'owner', 'success', 'warning']);
    });
});

describe('the stock palette is deleted', () => {
    const light = block('@theme {');

    /*
     * `--color-*: initial` is what makes an off-system colour impossible rather than merely
     * discouraged, so it is worth a test: someone adding a token block above it, or reordering
     * the file, would silently hand every consumer `bg-red-500` back.
     */
    test('the namespace reset is declared before any colour', () => {
        const reset = css.indexOf('--color-*: initial');
        const firstColor = css.indexOf('--color-fc-');
        expect(reset).toBeGreaterThan(-1);
        expect(reset).toBeLessThan(firstColor);
    });

    test('only the four theme-neutral primitives survive the reset', () => {
        const kept = Object.keys(light)
            .filter((key) => key.startsWith('--color-') && !key.startsWith('--color-fc-'))
            .filter((key) => key !== '--color-*')
            .map((key) => key.replace('--color-', ''));

        expect(kept.sort()).toEqual(['black', 'current', 'transparent', 'white']);
    });
});

function lightness(value: string): number {
    const match = value.match(/oklch\(\s*([\d.]+)/);
    if (!match) throw new Error(`not an oklch value: ${value}`);
    return Number(match[1]);
}

function luminance(l: number): number {
    const linear = l ** 3;
    const encoded = linear <= 0.0031308 ? 12.92 * linear : 1.055 * linear ** (1 / 2.4) - 0.055;
    return encoded <= 0.04045 ? encoded / 12.92 : ((encoded + 0.055) / 1.055) ** 2.4;
}

function contrast(a: string, b: string): number {
    const [x, y] = [luminance(lightness(a)), luminance(lightness(b))].sort((p, q) => q - p);
    return (x + 0.05) / (y + 0.05);
}

const themes = {
    light: block('@theme {'),
    dark: block(':root.dark')
};

function check(name: string, tokens: Record<string, string>): void {
    const merged = { ...themes.light, ...tokens };
    const ratio = (a: string, b: string) => contrast(merged[`--color-fc-${a}`], merged[`--color-fc-${b}`]);

    test(`${name}: the field fill is visibly off page, card and surface (1.1 to 1.5:1)`, () => {
        for (const neighbour of ['page', 'bg', 'component', 'surface']) {
            expect(ratio('field', neighbour)).toBeGreaterThanOrEqual(1.1);
            expect(ratio('field', neighbour)).toBeLessThanOrEqual(1.5);
        }
    });

    test(`${name}: text, placeholder and icons clear 4.5:1 on the field fill`, () => {
        expect(ratio('fg', 'field')).toBeGreaterThanOrEqual(4.5);
        expect(ratio('fg-muted', 'field')).toBeGreaterThanOrEqual(4.5);
    });

    test(`${name}: the accent fill is 3:1 against the field fill`, () => {
        expect(ratio('accent', 'field')).toBeGreaterThanOrEqual(3);
    });
}

describe('form control fill (subtle by design, strict on text)', () => {
    check('light', themes.light);
    check('dark', themes.dark);

    test('there is no separate hint token: fc-fg-muted passes on the field', () => {
        expect(themes.light['--color-fc-field-hint']).toBeUndefined();
    });
});

/*
 * With the fill this close to its surroundings, a Windows high contrast user would lose every
 * control edge. The forced-colors block is the one place muse draws a border.
 */
describe('forced-colors', () => {
    const forced = css.slice(css.indexOf('@media (forced-colors: active)'));

    test('fields, boxes, the switch track, popups and the progress track get a CanvasText edge', () => {
        for (const selector of ['input:not', 'textarea', 'select', "[role='switch'] + span", "[role='progressbar']", "[role='listbox']", "[role='menu']"]) {
            expect(forced).toContain(selector);
        }
        expect(forced).toContain('border: 1px solid CanvasText');
    });

    test('triggers and buttons get a ButtonText edge', () => {
        expect(forced).toContain("[role='combobox']");
        expect(forced).toContain('border: 1px solid ButtonText');
    });

    test('checked and active states use Highlight', () => {
        expect(forced).toContain('background-color: Highlight');
        expect(forced).toContain("[role='option'][data-active='true']");
        expect(forced).toContain('HighlightText');
    });

    test('forced-color-adjust is turned off for the switch thumb, the SVG marks and the active option only', () => {
        const rules = forced.split('}').filter((rule) => rule.includes('forced-color-adjust: none'));
        expect(rules).toHaveLength(3);
        expect(rules.join(' ')).toContain("[role='switch'] + span > span");
        expect(rules.join(' ')).toContain('+ svg');
        expect(rules.join(' ')).toContain("[role='option'][data-active='true']");
    });
});

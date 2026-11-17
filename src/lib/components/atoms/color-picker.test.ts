import { describe, expect, test } from 'bun:test';
import { render } from 'svelte/server';
import ColorPicker from './ColorPicker.svelte';

function swatch(value: string): string {
    const body = render(ColorPicker, { props: { value } }).body;
    return body.match(/<input[^>]*type="color"[^>]*>/)?.[0] ?? '';
}

describe('ColorPicker swatch', () => {
    test('an unset colour shows an empty swatch, not black', () => {
        expect(swatch('')).toContain('data-empty');
        expect(swatch('')).toContain('[&amp;::-webkit-color-swatch]:opacity-0');
    });

    test('a set colour shows its swatch', () => {
        expect(swatch('#e9e9e9')).not.toContain('data-empty');
        expect(swatch('#e9e9e9')).toContain('value="#e9e9e9"');
    });
});

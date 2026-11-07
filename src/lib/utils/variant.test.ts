import { expect, test } from 'bun:test';
import { buttonVariant, iconButtonVariant } from './variant.js';

test('Button keeps its names and maps outline to secondary', () => {
    expect(buttonVariant('outline')).toBe('secondary');
    for (const v of ['primary', 'secondary', 'ghost', 'danger', 'ghost-danger'] as const) expect(buttonVariant(v)).toBe(v);
});

test('IconButton maps its old names to the shared ones, keeping the old look', () => {
    expect(iconButtonVariant('default')).toBe('secondary');
    expect(iconButtonVariant('danger')).toBe('ghost-danger');
    for (const v of ['secondary', 'ghost', 'ghost-danger'] as const) expect(iconButtonVariant(v)).toBe(v);
});

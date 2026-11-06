import { describe, expect, test } from 'bun:test';
import { resolveField } from './field.js';

describe('resolveField', () => {
    const context = { id: 'f-control', describedBy: 'f-error', invalid: true };

    test('adopts the field when the control sets nothing', () => {
        expect(resolveField(context, {})).toEqual({ id: 'f-control', describedBy: 'f-error', invalid: 'true' });
    });

    test('an explicit prop wins over the field', () => {
        expect(resolveField(context, { id: 'mine', describedBy: 'mine-hint', invalid: 'false' })).toEqual({
            id: 'mine',
            describedBy: 'mine-hint',
            invalid: 'false'
        });
    });

    test('outside a field nothing is invented', () => {
        expect(resolveField(undefined, {})).toEqual({ id: undefined, describedBy: undefined, invalid: undefined });
        expect(resolveField({ ...context, invalid: false }, {}).invalid).toBeUndefined();
    });
});

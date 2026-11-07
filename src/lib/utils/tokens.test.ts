import { describe, expect, test } from 'bun:test';
import { tokenColumns } from './tokens.js';

describe('tokenColumns', () => {
    const all = { name: 'Name', prefix: 'Prefix', lastUsed: 'Last used', expires: 'Expires' };

    test('lists every column by default', () => {
        expect(tokenColumns(all)).toEqual(['Name', 'Prefix', 'Last used', 'Expires']);
    });

    test('drops the columns that are turned off', () => {
        expect(tokenColumns({ ...all, lastUsed: null })).toEqual(['Name', 'Prefix', 'Expires']);
        expect(tokenColumns({ ...all, expires: null })).toEqual(['Name', 'Prefix', 'Last used']);
        expect(tokenColumns({ ...all, lastUsed: null, expires: null })).toEqual(['Name', 'Prefix']);
    });
});

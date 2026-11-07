import { expect, test } from 'bun:test';
import { exactOption, filterOptions, fold } from './combobox.js';

const options = [
    { value: 'a', label: 'École primaire' },
    { value: 'b', label: 'Secondaire' },
    { value: 'c', label: 'Primaire du soir' },
    { value: 'd', label: 'Université', disabled: true }
];

test('fold drops case and accents', () => {
    expect(fold('  École ')).toBe('ecole');
});

test('an empty query keeps everything', () => {
    expect(filterOptions(options, '')).toEqual(options);
    expect(filterOptions(options, '  ')).toEqual(options);
});

test('prefix matches come before inner matches', () => {
    expect(filterOptions(options, 'prim').map((o) => o.value)).toEqual(['c', 'a']);
    expect(filterOptions(options, 'ECO').map((o) => o.value)).toEqual(['a', 'b']);
});

test('no match gives an empty list', () => {
    expect(filterOptions(options, 'zzz')).toEqual([]);
});

test('exactOption matches a whole label only', () => {
    expect(exactOption(options, 'secondaire')?.value).toBe('b');
    expect(exactOption(options, 'second')).toBeUndefined();
    expect(exactOption(options, '')).toBeUndefined();
});

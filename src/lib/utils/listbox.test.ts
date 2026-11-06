import { describe, expect, test } from 'bun:test';
import { moveActive, parseOptions, shouldNotify, typeahead, type RawNode } from './listbox.js';

const option = (value: string, text: string, disabled = false): RawNode => ({ tagName: 'OPTION', value, text, disabled });

describe('parseOptions', () => {
    test('flat options form one unlabelled group', () => {
        const model = parseOptions([option('a', ' Alpha '), option('b', 'Beta')]);
        expect(model.options.map((o) => [o.value, o.label, o.index])).toEqual([['a', 'Alpha', 0], ['b', 'Beta', 1]]);
        expect(model.groups).toHaveLength(1);
        expect(model.groups[0].label).toBeUndefined();
    });

    test('optgroups keep their label and disabled state flows down', () => {
        const model = parseOptions([
            option('x', 'Loose'),
            { tagName: 'OPTGROUP', label: 'Group', disabled: true, children: [option('y', 'Inside')] }
        ]);
        expect(model.groups.map((g) => g.label)).toEqual([undefined, 'Group']);
        expect(model.options[1]).toMatchObject({ label: 'Inside', disabled: true, index: 1 });
    });

    test('an option without a value falls back to its label', () => {
        expect(parseOptions([{ tagName: 'OPTION', text: 'Only' }]).options[0].value).toBe('Only');
    });
});

describe('moveActive', () => {
    const flags = [false, true, false, false, true];

    test('arrows skip disabled options and stop at the ends', () => {
        expect(moveActive(flags, 0, 'ArrowDown')).toBe(2);
        expect(moveActive(flags, 3, 'ArrowDown')).toBe(3);
        expect(moveActive(flags, 2, 'ArrowUp')).toBe(0);
        expect(moveActive(flags, 0, 'ArrowUp')).toBe(0);
    });

    test('home and end land on the first and last enabled option', () => {
        expect(moveActive(flags, 2, 'Home')).toBe(0);
        expect(moveActive(flags, 2, 'End')).toBe(3);
    });

    test('page keys jump ten and clamp to the enabled range', () => {
        const many = Array.from({ length: 25 }, () => false);
        expect(moveActive(many, 2, 'PageDown')).toBe(12);
        expect(moveActive(many, 20, 'PageDown')).toBe(24);
        expect(moveActive(many, 12, 'PageUp')).toBe(2);
        expect(moveActive(many, 3, 'PageUp')).toBe(0);
    });

    test('a menu wraps at the ends', () => {
        expect(moveActive(flags, 3, 'ArrowDown', true)).toBe(0);
        expect(moveActive(flags, 0, 'ArrowUp', true)).toBe(3);
    });

    test('from nothing active, down finds the first and up the last', () => {
        expect(moveActive(flags, -1, 'ArrowDown')).toBe(0);
        expect(moveActive(flags, -1, 'ArrowUp')).toBe(3);
    });
});

describe('typeahead', () => {
    const labels = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry'];
    const off = labels.map(() => false);

    test('a growing buffer matches the longer prefix', () => {
        const first = typeahead(labels, off, -1, '', 'a');
        expect(first.index).toBe(0);
        expect(typeahead(labels, off, first.index, first.buffer, 'p').index).toBe(0);
        expect(typeahead(labels, off, 0, 'ap', 'r').index).toBe(1);
    });

    test('repeating a letter cycles through its matches', () => {
        expect(typeahead(labels, off, 2, 'b', 'b').index).toBe(3);
        expect(typeahead(labels, off, 3, 'bb', 'b').index).toBe(2);
    });

    test('disabled options never match and no match is -1', () => {
        expect(typeahead(labels, [true, ...off.slice(1)], -1, '', 'a').index).toBe(1);
        expect(typeahead(labels, off, 0, '', 'z').index).toBe(-1);
    });
});

describe('shouldNotify', () => {
    test('a different option notifies', () => {
        expect(shouldNotify('a', 'b')).toBe(true);
    });

    test('the bound value decides, not the native element', () => {
        expect(shouldNotify('a', 'a')).toBe(false);
    });

    test('after an outside write synced the prop, the other option still notifies', () => {
        expect(shouldNotify('x', 'y')).toBe(true);
    });
});

import { describe, expect, test } from 'bun:test';
import { addTags, matchSuggestions, splitTags } from './tags.js';

describe('splitTags', () => {
    test('splits on commas, semicolons and line breaks and drops blanks', () => {
        expect(splitTags(' a@x.fr, b@x.fr;\nc@x.fr ,, ')).toEqual(['a@x.fr', 'b@x.fr', 'c@x.fr']);
        expect(splitTags('   ')).toEqual([]);
    });
});

describe('addTags', () => {
    test('trims and ignores duplicates', () => {
        expect(addTags(['a'], [' b ', 'a', 'b'])).toEqual(['a', 'b']);
    });

    test('stops at max', () => {
        expect(addTags(['a'], ['b', 'c', 'd'], { max: 2 })).toEqual(['a', 'b']);
    });

    test('drops invalid tags unless told to keep them', () => {
        const validate = (tag: string) => tag.includes('@');
        expect(addTags([], ['a@x', 'nope'], { validate })).toEqual(['a@x']);
        expect(addTags([], ['a@x', 'nope'], { validate, allowInvalid: true })).toEqual(['a@x', 'nope']);
    });
});

describe('matchSuggestions', () => {
    test('filters by draft, skips chosen ones and caps the list', () => {
        expect(matchSuggestions(['Alpha', 'alps', 'beta'], ['alps'], 'AL')).toEqual(['Alpha']);
        expect(matchSuggestions(['a', 'b', 'c'], [], '', 2)).toEqual(['a', 'b']);
    });
});

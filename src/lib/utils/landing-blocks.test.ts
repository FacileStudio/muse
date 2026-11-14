import { describe, expect, test } from 'bun:test';
import { icons } from '../icons.js';
import { developerRows, sharedNote, worksWithApps } from './landing-blocks.js';

describe('developerRows', () => {
    test('a kind brings its icon and message key', () => {
        const [row] = developerRows([{ kind: 'source', href: 'https://github.com/FacileStudio/muse' }]);
        expect(row).toEqual({
            icon: icons.github,
            title: 'developers.source',
            fromKey: true,
            text: undefined,
            href: 'https://github.com/FacileStudio/muse',
            command: undefined
        });
    });

    test('icon and title override the kind, and a given title is not a key', () => {
        const [row] = developerRows([{ kind: 'cli', icon: icons.bolt, title: 'nuage CLI', command: '  brew install nuage ' }]);
        expect(row.icon).toBe(icons.bolt);
        expect(row.title).toBe('nuage CLI');
        expect(row.fromKey).toBe(false);
        expect(row.command).toBe('brew install nuage');
    });

    test('an unsafe href renders no link, and a row with no title is skipped', () => {
        const rows = developerRows([{ kind: 'api', href: 'javascript:alert(1)' }, { text: 'orphan' }, { kind: 'mcp', command: '   ' }]);
        expect(rows.map((r) => [r.title, r.href, r.command])).toEqual([
            ['developers.api', null, undefined],
            ['developers.mcp', null, undefined]
        ]);
    });
});

describe('worksWithApps', () => {
    test('keeps safe links and drops unsafe ones without dropping the app', () => {
        const apps = worksWithApps([
            { name: 'Agenda', icon: 'solar:calendar-add-bold-duotone', line: 'Meetings land in the calendar', href: 'https://agenda.facile.studio' },
            { name: 'Opus', icon: 'solar:slider-vertical-minimalistic-bold-duotone', line: 'Tasks', href: 'javascript:alert(1)' },
            { name: 'Nuage', icon: 'solar:cloud-bold-duotone', line: 'Files', href: '//evil.test' }
        ]);
        expect(apps.map((a) => a.href)).toEqual(['https://agenda.facile.studio', undefined, undefined]);
    });
});

describe('plan notes', () => {
    const keys = ['solo', 'pro', 'studio'];

    test('a star note shared by every plan shows once', () => {
        expect(sharedNote(keys, { '*': 'Included in every plan' })).toBe('Included in every plan');
        expect(sharedNote(keys, { solo: 'Same', pro: 'Same', studio: 'Same' })).toBe('Same');
    });

    test('a plan with its own line keeps the notes on the cards', () => {
        const notes = { solo: 'Sign-up only', '*': 'Needs a paid plan' };
        expect(sharedNote(keys, notes)).toBeUndefined();
    });

    test('no note, a missing plan note or a single plan shares nothing', () => {
        expect(sharedNote(keys, {})).toBeUndefined();
        expect(sharedNote(keys, { pro: 'Pro only' })).toBeUndefined();
        expect(sharedNote(['solo'], { '*': 'Alone' })).toBeUndefined();
    });
});

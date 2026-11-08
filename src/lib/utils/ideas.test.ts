import { describe, expect, test } from 'bun:test';
import { staticI18n } from '../i18n/context.svelte.js';
import { icons } from '../icons.js';
import {
    IDEAS_ICON,
    countNewIdeas,
    hasActiveRun,
    ideaActions,
    ideaKind,
    ideaRunState,
    isNewIdea,
    runTone,
    type Idea,
    type IdeaRunState
} from './ideas.js';
import { ideasNavItem } from './ideas-nav.js';
import { formatArgs, ideasView, relativeTime } from './ideas-view.js';

const idea = (id: string, extra: Partial<Idea> = {}): Idea => ({ id, kind: 'mail', title: id, why: id, ...extra });
const NOW = Date.parse('2026-11-08T12:00:00Z');

describe('ideas icon and kinds', () => {
    test('the entry icon is the lightbulb-bolt', () => {
        expect(IDEAS_ICON).toBe('solar:lightbulb-bolt-linear');
        expect(icons.ideas).toBe(IDEAS_ICON);
    });

    test('known kinds map to an icon and a translated label', () => {
        const { t } = staticI18n('fr');
        expect(ideaKind({ kind: 'event' }, t)).toEqual({ icon: icons.calendar, label: 'Événement' });
        expect(ideaKind({ kind: 'follow_up' }, t).icon).toBe(icons.history);
    });

    test('an app-specific kind falls back to other unless the idea names its own', () => {
        const { t } = staticI18n('en');
        expect(ideaKind({ kind: 'lead_signal' }, t)).toEqual({ icon: icons.widget, label: 'Idea' });
        expect(ideaKind({ kind: 'lead_signal', icon: 'x:y', kindLabel: 'Lead' }, t)).toEqual({ icon: 'x:y', label: 'Lead' });
    });
});

describe('run state mapping', () => {
    test('an idea without a run is idle', () => {
        expect(ideaRunState(idea('a'))).toBe('idle');
        expect(ideaRunState(idea('a', { run: { state: 'failed' } }))).toBe('failed');
    });

    test('each state offers the right actions', () => {
        const table: Record<IdeaRunState, [boolean, boolean, boolean, boolean]> = {
            idle: [true, false, true, false],
            running: [false, false, false, false],
            needs_approval: [false, false, true, true],
            done: [false, false, true, false],
            failed: [false, true, true, false]
        };
        for (const [state, [run, retry, dismiss, approve]] of Object.entries(table)) {
            expect(ideaActions(state as IdeaRunState)).toEqual({ run, retry, dismiss, approve });
        }
    });

    test('only running states carry a tone, and idle none', () => {
        expect(runTone('idle')).toBeNull();
        expect(runTone('needs_approval')).toBe('warning');
        expect(runTone('failed')).toBe('danger');
    });
});

describe('new idea count', () => {
    test('counts new ideas that have not expired and are not done', () => {
        const ideas = [
            idea('new'),
            idea('saved', { status: 'saved' }),
            idea('dismissed', { status: 'dismissed' }),
            idea('old', { expiresAt: '2026-11-07T00:00:00Z' }),
            idea('later', { expiresAt: '2026-11-09T00:00:00Z' }),
            idea('done', { run: { state: 'done' } }),
            idea('running', { run: { state: 'running' } })
        ];
        expect(countNewIdeas(ideas, NOW)).toBe(3);
        expect(isNewIdea(idea('bad', { expiresAt: 'nonsense' }), NOW)).toBe(true);
    });

    test('hasActiveRun sees running and approval waits', () => {
        expect(hasActiveRun([idea('a'), idea('b', { run: { state: 'done' } })])).toBe(false);
        expect(hasActiveRun([idea('a', { run: { state: 'needs_approval' } })])).toBe(true);
    });
});

describe('nav item', () => {
    const i18n = staticI18n('en');

    test('carries the icon, the label and no marks when idle', () => {
        expect(ideasNavItem({ href: '/ideas', i18n })).toEqual({
            label: 'Ideas',
            href: '/ideas',
            icon: IDEAS_ICON,
            active: false,
            badge: undefined,
            busy: undefined,
            hint: undefined
        });
    });

    test('speaks the count and the running state, in the locale', () => {
        const item = ideasNavItem({ href: '/ideas', count: 3, running: true, active: true, i18n });
        expect(item).toMatchObject({ badge: 3, busy: true, active: true, hint: '3 new ideas, in progress' });
        expect(ideasNavItem({ href: '/i', count: 1, i18n }).hint).toBe('1 new idea');
        expect(ideasNavItem({ href: '/i', count: 2, i18n: staticI18n('fr') })).toMatchObject({
            label: 'Idées',
            hint: '2 nouvelles idées'
        });
    });
});

describe('page view and helpers', () => {
    test('picks the body of the page', () => {
        const some = [idea('a')];
        expect(ideasView({ ideas: some, loading: true })).toBe('loading');
        expect(ideasView({ ideas: [], error: 'x' })).toBe('error');
        expect(ideasView({ ideas: some, error: 'x' })).toBe('list');
        expect(ideasView({ ideas: [], generating: true })).toBe('busy');
        expect(ideasView({ ideas: [], generating: true, error: 'x' })).toBe('error');
        expect(ideasView({ ideas: [] })).toBe('empty');
    });

    test('relative time reads in the locale and ignores bad input', () => {
        expect(relativeTime(NOW - 2 * 3_600_000, 'en', NOW)).toBe('2 hours ago');
        expect(relativeTime(NOW - 2 * 3_600_000, 'fr', NOW)).toBe('il y a 2 heures');
        expect(relativeTime(NOW - 10_000, 'en', NOW)).toBe('now');
        expect(relativeTime('nonsense', 'en', NOW)).toBe('');
        expect(relativeTime(null, 'en', NOW)).toBe('');
    });

    test('formats approval arguments', () => {
        expect(formatArgs(undefined)).toBe('');
        expect(formatArgs('rm -rf')).toBe('rm -rf');
        expect(formatArgs({ a: 1 })).toBe('{\n  "a": 1\n}');
        const loop: Record<string, unknown> = {};
        loop.self = loop;
        expect(formatArgs(loop)).toBe('[object Object]');
    });
});

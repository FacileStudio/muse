import type { I18n } from '../i18n/context.svelte.js';
import type { Idea, IdeaRunState } from './ideas.js';

export type IdeasView = 'loading' | 'error' | 'busy' | 'empty' | 'list';

export type IdeasViewInput = { ideas: readonly Idea[]; loading?: boolean; generating?: boolean; error?: string | null };

/** Which body the Ideas page shows. An error with ideas on screen keeps the list and adds an alert. */
export function ideasView({ ideas, loading = false, generating = false, error = null }: IdeasViewInput): IdeasView {
    if (loading) return 'loading';
    if (ideas.length > 0) return 'list';
    if (error) return 'error';
    return generating ? 'busy' : 'empty';
}

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
    ['day', 86_400_000],
    ['hour', 3_600_000],
    ['minute', 60_000]
];

/** "2 hours ago" in `locale`. Under a minute reads "now". Empty for a missing or invalid time. */
export function relativeTime(value: string | number | Date | null | undefined, locale: string, now = Date.now()): string {
    if (value === null || value === undefined) return '';
    const then = new Date(value).getTime();
    if (Number.isNaN(then)) return '';
    const format = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    const diff = then - now;
    const [unit, size] = UNITS.find(([, ms]) => Math.abs(diff) >= ms) ?? ['second', 1000];
    return format.format(unit === 'second' ? 0 : Math.round(diff / size), unit);
}

/** The arguments of an approval as text: a string as is, an object as indented JSON. */
export function formatArgs(args: Record<string, unknown> | string | undefined): string {
    if (args === undefined) return '';
    if (typeof args === 'string') return args;
    try {
        return JSON.stringify(args, null, 2);
    } catch {
        return String(args);
    }
}

/** The badge text of a run state; empty for idle, which shows no badge. */
export function runLabel(state: IdeaRunState, t: I18n['t']): string {
    return state === 'idle' ? '' : t(`ideas.state.${state}`);
}

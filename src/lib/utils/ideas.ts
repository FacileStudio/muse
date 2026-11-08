import type { I18n } from '../i18n/context.svelte.js';
import { icons } from '../icons.js';
import type { Tone } from './tone.js';

/** The icon of the Ideas entry, the same in every app. */
export const IDEAS_ICON = icons.ideas;

/** The kinds Bulle proposes. Any other string is an app-specific kind. */
export const IDEA_KINDS = ['mail', 'task', 'event', 'follow_up', 'research', 'other'] as const;

export type KnownIdeaKind = (typeof IDEA_KINDS)[number];

/** A known kind, or an open string for an app's own kinds (set `icon` and `kindLabel` on the idea). */
export type IdeaKind = KnownIdeaKind | (string & {});

export type IdeaRunState = 'idle' | 'running' | 'needs_approval' | 'done' | 'failed';

export type IdeaStatus = 'new' | 'saved' | 'dismissed' | 'done' | 'expired';

export type IdeaSource = { label: string; href?: string };

export type IdeaOutput = { label: string; href: string };

/** A pending confirmation: what the assistant wants to do, and the arguments it would use. */
export type ApprovalRequest = {
    id: string;
    tool: string;
    summary: string;
    args?: Record<string, unknown> | string;
};

export type IdeaRun = {
    state: IdeaRunState;
    /** What the run did, in one or two sentences. Shown when the run is done. */
    summary?: string;
    /** Links to what the run created. */
    outputs?: IdeaOutput[];
    /** Why the run failed. */
    error?: string;
    approval?: ApprovalRequest;
};

export type Idea = {
    id: string;
    kind: IdeaKind;
    title: string;
    why: string;
    draft?: string;
    sources?: IdeaSource[];
    status?: IdeaStatus;
    /** ISO time after which the idea no longer counts as new. */
    expiresAt?: string;
    /** Overrides the icon of the kind, for an app-specific kind. */
    icon?: string;
    /** Overrides the label of the kind, for an app-specific kind. */
    kindLabel?: string;
    run?: IdeaRun;
    /** Opens the same run as a conversation in Bulle. */
    continueHref?: string;
};

export type IdeaActions = { run: boolean; retry: boolean; dismiss: boolean; approve: boolean };

const KIND_ICONS: Record<KnownIdeaKind, string> = {
    mail: icons.mail,
    task: icons.check,
    event: icons.calendar,
    follow_up: icons.history,
    research: icons.search,
    other: icons.widget
};

const RUN_TONES: Record<IdeaRunState, Tone | null> = {
    idle: null,
    running: 'info',
    needs_approval: 'warning',
    done: 'success',
    failed: 'danger'
};

function isKnownKind(kind: string): kind is KnownIdeaKind {
    return (IDEA_KINDS as readonly string[]).includes(kind);
}

/** The icon and label of an idea's kind. Unknown kinds fall back to `other` unless the idea names its own. */
export function ideaKind(idea: Pick<Idea, 'kind' | 'icon' | 'kindLabel'>, t: I18n['t']): { icon: string; label: string } {
    const known = isKnownKind(idea.kind) ? idea.kind : 'other';
    return {
        icon: idea.icon ?? KIND_ICONS[known],
        label: idea.kindLabel ?? t(`ideas.kind.${known}`)
    };
}

/** The run state of an idea; an idea with no run is idle. */
export function ideaRunState(idea: Pick<Idea, 'run'>): IdeaRunState {
    return idea.run?.state ?? 'idle';
}

/** The badge tone of a run state, or `null` when the state shows no badge. */
export function runTone(state: IdeaRunState): Tone | null {
    return RUN_TONES[state];
}

/** Which actions a run state offers. A running idea offers none; an approval offers approve and decline. */
export function ideaActions(state: IdeaRunState): IdeaActions {
    return {
        run: state === 'idle',
        retry: state === 'failed',
        dismiss: state !== 'running',
        approve: state === 'needs_approval'
    };
}

/** True while an idea still counts as new: not dismissed, saved, done or expired, and not past `expiresAt`. */
export function isNewIdea(idea: Pick<Idea, 'status' | 'expiresAt' | 'run'>, now = Date.now()): boolean {
    if ((idea.status ?? 'new') !== 'new') return false;
    if (ideaRunState(idea) === 'done') return false;
    if (!idea.expiresAt) return true;
    const expires = Date.parse(idea.expiresAt);
    return Number.isNaN(expires) || expires > now;
}

/** The number shown on the Ideas entry. */
export function countNewIdeas(ideas: readonly Idea[], now = Date.now()): number {
    return ideas.filter((idea) => isNewIdea(idea, now)).length;
}

/** True when any idea is running or waiting on an approval. */
export function hasActiveRun(ideas: readonly Idea[]): boolean {
    return ideas.some((idea) => ['running', 'needs_approval'].includes(ideaRunState(idea)));
}

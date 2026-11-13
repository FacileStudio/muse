import type { I18n } from '../i18n/context.svelte.js';
import type { Tone } from './tone.js';

/** The realtime link as the app sees it. Only `live` is silent. */
export type ConnectionState = 'live' | 'connecting' | 'offline' | 'stopped';

/** Every string `ConnectionHint` shows. `offlineDetail` is the longer text behind the offline pill. */
export interface ConnectionHintLabels {
    connecting: string;
    offline: string;
    offlineDetail: string;
    stopped: string;
}

/** How one connection state looks: the dot's tone, whether it pulses, and which label it reads. */
export interface ConnectionLook {
    tone: Tone;
    pulse: boolean;
    label: keyof ConnectionHintLabels;
    detail?: keyof ConnectionHintLabels;
}

/** The `ConnectionHint` strings in the active locale, with the caller's overrides on top. */
export function connectionHintLabels(t: I18n['t'], overrides: Partial<ConnectionHintLabels> = {}): ConnectionHintLabels {
    return {
        connecting: t('connection.connecting'),
        offline: t('connection.offline'),
        offlineDetail: t('connection.offlineDetail'),
        stopped: t('connection.stopped'),
        ...overrides
    };
}

const LOOKS: Record<Exclude<ConnectionState, 'live'>, ConnectionLook> = {
    connecting: { tone: 'warning', pulse: true, label: 'connecting' },
    offline: { tone: 'neutral', pulse: false, label: 'offline', detail: 'offlineDetail' },
    stopped: { tone: 'danger', pulse: false, label: 'stopped' }
};

/** How a connection state renders, or `null` for `live`, which shows nothing. */
export function connectionLook(state: ConnectionState): ConnectionLook | null {
    return state === 'live' ? null : LOOKS[state];
}

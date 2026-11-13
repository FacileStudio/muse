import { describe, expect, test } from 'bun:test';
import { staticI18n } from '../i18n/context.svelte.js';
import { connectionHintLabels, connectionLook } from './connection.js';
import { fill, followedPeer, halo, peerAction, presenceLabels, safeColor, splitPeers, type PresencePeer } from './presence.js';

const peers: PresencePeer[] = ['Léa', 'Marc', 'Inès', 'Paul', 'Zoé', 'Noé'].map((name, i) => ({ id: i + 1, name, color: '#AD9EF0' }));
const fr = staticI18n('fr').t;

describe('splitPeers', () => {
    test('draws up to max, folds the rest', () => {
        expect(splitPeers(peers.slice(0, 4), 4).hidden).toEqual([]);
        const { shown, hidden } = splitPeers(peers, 4);
        expect(shown.map((p) => p.name)).toEqual(['Léa', 'Marc', 'Inès', 'Paul']);
        expect(hidden.map((p) => p.name)).toEqual(['Zoé', 'Noé']);
    });

    test('a max below one still draws one avatar', () => {
        expect(splitPeers(peers, 0).shown).toHaveLength(1);
    });
});

describe('presence labels', () => {
    test('French defaults, counted overflow, overrides win', () => {
        const labels = presenceLabels(fr, 2);
        expect(labels.region).toBe('Personnes connectées');
        expect(labels.more).toBe('2 autres personnes');
        expect(fill(labels.following, { name: 'Léa' })).toBe('Vous suivez Léa');
        expect(presenceLabels(fr, 3, { more: '+{count} here' }).more).toBe('+3 here');
    });

    test('the avatar action follows, stops following, or just names', () => {
        const labels = presenceLabels(fr, 0);
        expect(peerAction(peers[0], null, true, labels)).toBe('Suivre Léa');
        expect(peerAction(peers[0], 1, true, labels)).toBe('Arrêter de suivre');
        expect(peerAction(peers[0], 1, false, labels)).toBe('Léa');
    });

    test('a followed peer who left is nobody', () => {
        expect(followedPeer(peers, 2)?.name).toBe('Marc');
        expect(followedPeer(peers, 99)).toBeUndefined();
        expect(followedPeer(peers, null)).toBeUndefined();
    });
});

describe('peer colour', () => {
    test('plain colours pass, anything that could close the declaration does not', () => {
        expect(safeColor('#AD9EF0')).toBe('#AD9EF0');
        expect(safeColor('oklch(0.7 0.1 250 / 50%)')).toBe('oklch(0.7 0.1 250 / 50%)');
        expect(safeColor('red; background: url(x)')).toBe('currentColor');
        expect(halo('#fff')).toBe('0 0 0 2px var(--color-fc-bg), 0 0 0 4px #fff');
    });
});

describe('connection hint', () => {
    test('live is silent, the rest map to a tone', () => {
        expect(connectionLook('live')).toBeNull();
        expect(connectionLook('connecting')).toMatchObject({ tone: 'warning', pulse: true });
        expect(connectionLook('offline')?.detail).toBe('offlineDetail');
        expect(connectionLook('stopped')?.tone).toBe('danger');
    });

    test('French strings', () => {
        const labels = connectionHintLabels(fr);
        expect(labels.connecting).toBe('Reconnexion…');
        expect(labels.offline).toBe('Hors ligne');
        expect(labels.stopped).toBe('Déconnecté');
        expect(connectionHintLabels(fr, { stopped: 'Arrêté' }).stopped).toBe('Arrêté');
    });
});

import { describe, expect, test } from 'bun:test';
import { pendingClientName } from './pending.js';

describe('pendingClientName', () => {
    test('names Bulle, a client URL by its host, and anything else as is', () => {
        expect(pendingClientName('bulle')).toBe('Bulle');
        expect(pendingClientName('https://claude.ai/mcp/client')).toBe('claude.ai');
        expect(pendingClientName('cursor')).toBe('cursor');
        expect(pendingClientName('')).toBe('?');
    });
});

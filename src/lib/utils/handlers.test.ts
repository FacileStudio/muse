import { describe, expect, test } from 'bun:test';
import { chain, consumeEscape } from './handlers.js';

describe('chain', () => {
    test('calls the consumer handler, then the internal one, with the same event', () => {
        const calls: string[] = [];
        chain<string>((e) => calls.push(`consumer:${e}`), (e) => calls.push(`internal:${e}`))('x');
        expect(calls).toEqual(['consumer:x', 'internal:x']);
    });

    test('runs the internal handler without a consumer handler', () => {
        let ran = false;
        chain<string>(undefined, () => (ran = true))('x');
        expect(ran).toBe(true);
    });

    test('runs the internal handler even when the consumer handler throws', () => {
        let ran = false;
        expect(() => chain<string>(() => { throw new Error('boom'); }, () => (ran = true))('x')).toThrow('boom');
        expect(ran).toBe(true);
    });
});

describe('consumeEscape', () => {
    const fake = (key: string) => {
        const event = { key, stopped: false, stopPropagation() { this.stopped = true; } };
        return event;
    };

    test('open: Escape closes and stops propagation', () => {
        const event = fake('Escape');
        let closed = 0;
        expect(consumeEscape(event, true, () => closed++)).toBe(true);
        expect(event.stopped).toBe(true);
        expect(closed).toBe(1);
    });

    test('closed: Escape is left alone', () => {
        const event = fake('Escape');
        let closed = 0;
        expect(consumeEscape(event, false, () => closed++)).toBe(false);
        expect(event.stopped).toBe(false);
        expect(closed).toBe(0);
    });

    test('open: other keys are left alone', () => {
        const event = fake('a');
        expect(consumeEscape(event, true, () => {})).toBe(false);
        expect(event.stopped).toBe(false);
    });
});

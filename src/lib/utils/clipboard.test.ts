import { afterEach, describe, expect, test } from 'bun:test';
import { copyText } from './clipboard.js';

const original = Object.getOwnPropertyDescriptor(globalThis, 'navigator');

afterEach(() => {
    if (original) Object.defineProperty(globalThis, 'navigator', original);
    else Reflect.deleteProperty(globalThis, 'navigator');
});

function stub(writeText: (text: string) => Promise<void>) {
    Object.defineProperty(globalThis, 'navigator', { value: { clipboard: { writeText } }, configurable: true });
}

describe('copyText', () => {
    test('writes through the async clipboard API', async () => {
        const seen: string[] = [];
        stub(async (text) => void seen.push(text));
        expect(await copyText('hello')).toBe(true);
        expect(seen).toEqual(['hello']);
    });

    test('reports a refusal instead of throwing', async () => {
        stub(async () => {
            throw new Error('denied');
        });
        expect(await copyText('x')).toBe(false);
    });

    test('is false without a clipboard or a document', async () => {
        Object.defineProperty(globalThis, 'navigator', { value: {}, configurable: true });
        expect(await copyText('x')).toBe(false);
    });
});

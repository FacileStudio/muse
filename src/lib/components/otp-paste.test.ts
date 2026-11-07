import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { sanitizeCode } from '../utils/otp.js';

test('InputOtp leaves length to sanitizeCode so a pasted "123 456" is not cut before it is cleaned', () => {
    const source = readFileSync(join(import.meta.dir, 'molecules/InputOtp.svelte'), 'utf8');
    expect(source).not.toMatch(/maxlength=\{/);
    expect(sanitizeCode('123 456', 6)).toBe('123456');
    expect(sanitizeCode('123-456-789', 6)).toBe('123456');
});

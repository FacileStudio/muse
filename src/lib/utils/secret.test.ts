import { expect, test } from 'bun:test';
import { REDACTED, isRedacted, maskSecret } from './secret.js';

test('the mask never leaks the length of the secret', () => {
    const short = maskSecret('a'.repeat(20), 'full');
    const long = maskSecret('a'.repeat(400), 'full');
    expect(short).toBe(long);
});

test('ends mode keeps the issuer prefix and the last four, and nothing else', () => {
    const masked = maskSecret('vis_rw_9c1d4e7f0b2a3f9e');
    expect(masked).toBe(`vis_${REDACTED}3f9e`);
    expect(masked).not.toContain('9c1d4e7f0b2a');
});

test('a secret too short to split safely is masked whole', () => {
    expect(maskSecret('short')).toBe(REDACTED);
    expect(maskSecret('exactly12chr')).toBe(REDACTED);
});

test('an already-redacted value never gets re-masked into a fake prefix', () => {
    expect(maskSecret(REDACTED)).toBe(REDACTED);
    expect(isRedacted(REDACTED)).toBe(true);
    expect(isRedacted('sk_live_real_key_here')).toBe(false);
    expect(isRedacted('')).toBe(false);
});

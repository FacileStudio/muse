/**
 * The placeholder a stored secret wears when the server refuses to send it back.
 *
 * Several suite APIs (Nook, Perception) return this string *as the field's value* and treat
 * receiving it unchanged as "keep what you have". So it is a wire contract, not decoration —
 * a form that posts these eight dots back is asking to keep the stored secret, and one that
 * posts them as a new value has just overwritten a live credential with punctuation.
 */
export const REDACTED = '••••••••';

/** True when a value is a redaction placeholder rather than a real secret. */
export function isRedacted(value: string): boolean {
    return value.length > 0 && /^•+$/.test(value.trim());
}

/**
 * Mask a secret for display.
 *
 * The dot run is a fixed length and never mirrors the real one: a placeholder that grows
 * with the secret tells a shoulder-surfer how long it is, which is free information for
 * whoever is guessing it. `ends` keeps the first four characters — the issuer prefix, the
 * `sk_` / `ghp_` / `vis_rw_` part that is public by design — and the last four, so a key can
 * be told apart from its neighbours in a list without being readable.
 */
export function maskSecret(value: string, mode: 'ends' | 'full' = 'ends'): string {
    if (!value || isRedacted(value)) return REDACTED;
    if (mode === 'full' || value.length <= 12) return REDACTED;
    return `${value.slice(0, 4)}${REDACTED}${value.slice(-4)}`;
}

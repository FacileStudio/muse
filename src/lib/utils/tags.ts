export type TagRules = { max?: number; validate?: (tag: string) => boolean; allowInvalid?: boolean };

/** Splits typed or pasted text into trimmed, non-empty tags on commas, semicolons and line breaks. */
export function splitTags(text: string): string[] {
    return text
        .split(/[,;\n\r]+/)
        .map((part) => part.trim())
        .filter(Boolean);
}

/** `current` plus the new tags: trimmed, no duplicate, capped at `max`, and with invalid ones dropped unless `allowInvalid`. */
export function addTags(current: readonly string[], incoming: readonly string[], rules: TagRules = {}): string[] {
    const next = [...current];
    for (const raw of incoming) {
        const tag = raw.trim();
        if (!tag || next.includes(tag)) continue;
        if (rules.max !== undefined && next.length >= rules.max) break;
        if (rules.validate && !rules.allowInvalid && !rules.validate(tag)) continue;
        next.push(tag);
    }
    return next;
}

/** Suggestions that match the draft, are not already chosen, and fit the cap. */
export function matchSuggestions(suggestions: readonly string[], value: readonly string[], draft: string, limit = 12): string[] {
    const needle = draft.trim().toLowerCase();
    return suggestions.filter((tag) => !value.includes(tag) && tag.toLowerCase().includes(needle)).slice(0, limit);
}

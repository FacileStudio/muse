export type ComboOption = { value: string; label: string; disabled?: boolean };

/** Lower-cases and strips accents, so "ecole" finds "École". */
export function fold(text: string): string {
    return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();
}

/** The option whose label is exactly `text`, ignoring case and accents. */
export function exactOption(options: ComboOption[], text: string): ComboOption | undefined {
    const needle = fold(text);
    return needle ? options.find((o) => fold(o.label) === needle) : undefined;
}

/** The options that match what was typed, labels that start with it first. An empty query keeps them all. */
export function filterOptions(options: ComboOption[], query: string): ComboOption[] {
    const needle = fold(query);
    if (!needle) return options;
    const starts: ComboOption[] = [];
    const contains: ComboOption[] = [];
    for (const option of options) {
        const label = fold(option.label);
        if (label.startsWith(needle)) starts.push(option);
        else if (label.includes(needle)) contains.push(option);
    }
    return [...starts, ...contains];
}

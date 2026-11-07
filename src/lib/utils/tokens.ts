export type TokenColumnLabels = { name: string; prefix: string; lastUsed: string | null; expires: string | null };

/** The header labels of the token table, in order, without the columns an app turned off. */
export function tokenColumns(labels: TokenColumnLabels): string[] {
    return [labels.name, labels.prefix, labels.lastUsed, labels.expires].filter((label): label is string => label !== null);
}

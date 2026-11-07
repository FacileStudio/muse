export type OtpKind = 'numeric' | 'alphanumeric';

/** Keeps the characters a code of this kind allows and cuts it to `length`. Pasted spaces and dashes drop out. */
export function sanitizeCode(text: string, length: number, kind: OtpKind = 'numeric'): string {
    const allowed = kind === 'numeric' ? /[0-9]/g : /[a-z0-9]/gi;
    return (text.match(allowed) ?? []).join('').slice(0, length);
}

/** The character shown in each of `length` cells; an empty string for a cell not yet filled. */
export function cellsOf(value: string, length: number): string[] {
    return Array.from({ length }, (_, i) => value[i] ?? '');
}

/** The cell that holds the caret: the next one to fill, or the last once the code is full. */
export function activeCell(value: string, length: number): number {
    return Math.min(value.length, length - 1);
}

export function isComplete(value: string, length: number): boolean {
    return length > 0 && value.length === length;
}

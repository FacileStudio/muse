import type { MoveKey } from './listbox.js';

/** What a key press means for a select-only combobox or a menu. Pure, checked by `keys.test.ts`. */

export type KeyAction =
    | { kind: 'open'; at: 'selected' | 'first' | 'last' }
    | { kind: 'move'; key: MoveKey }
    | { kind: 'commit' }
    | { kind: 'close' }
    | { kind: 'tab' }
    | { kind: 'type'; char: string }
    | { kind: 'ignore' };

export type KeyInput = { key: string; altKey?: boolean; ctrlKey?: boolean; metaKey?: boolean };

const MOVES = new Set<string>(['ArrowDown', 'ArrowUp', 'Home', 'End', 'PageDown', 'PageUp']);
const IGNORE: KeyAction = { kind: 'ignore' };

function isPrintable(input: KeyInput): boolean {
    return input.key.length === 1 && !input.ctrlKey && !input.metaKey && !input.altKey;
}

function closedAction(input: KeyInput, typing: boolean): KeyAction {
    const { key } = input;
    if (key === ' ' && typing) return { kind: 'type', char: ' ' };
    if (key === 'ArrowDown' || key === 'Enter' || key === ' ') return { kind: 'open', at: 'selected' };
    if (key === 'ArrowUp' || key === 'Home') return { kind: 'open', at: 'first' };
    if (key === 'End') return { kind: 'open', at: 'last' };
    return isPrintable(input) ? { kind: 'type', char: key } : IGNORE;
}

function openAction(input: KeyInput, typing: boolean): KeyAction {
    const { key } = input;
    if (key === ' ' && typing) return { kind: 'type', char: ' ' };
    if (key === 'ArrowUp' && input.altKey) return { kind: 'commit' };
    if (MOVES.has(key)) return { kind: 'move', key: key as MoveKey };
    if (key === 'Enter' || key === ' ') return { kind: 'commit' };
    if (key === 'Escape') return { kind: 'close' };
    if (key === 'Tab') return { kind: 'tab' };
    return isPrintable(input) ? { kind: 'type', char: key } : IGNORE;
}

/** What a key press means, given whether the popup is open and whether a type-ahead is running. */
export function keyAction(open: boolean, input: KeyInput, typing = false): KeyAction {
    return open ? openAction(input, typing) : closedAction(input, typing);
}

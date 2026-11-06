/**
 * The pure half of `Select`: parsing `<option>` trees, navigation and type-ahead. Nothing here
 * touches the DOM, so every rule is checked by `listbox.test.ts`. Behaviour follows the WAI-ARIA
 * APG select-only combobox.
 */

export type ListOption = { value: string; label: string; disabled: boolean; index: number };
export type ListGroup = { id: string; label: string | undefined; options: ListOption[] };
export type ListModel = { options: ListOption[]; groups: ListGroup[] };

export type RawNode = {
    tagName: string;
    value?: string;
    label?: string;
    text?: string;
    disabled?: boolean;
    children?: ArrayLike<RawNode>;
};

/** Reads a native `<select>`'s children (`option`, `optgroup`) into groups and a flat option list. */
export function parseOptions(nodes: ArrayLike<RawNode>): ListModel {
    const options: ListOption[] = [];
    const groups: ListGroup[] = [];
    let loose: ListGroup | undefined;

    const take = (node: RawNode, forced: boolean): ListOption => {
        const label = (node.label || node.text || node.value || '').trim();
        const disabled = forced || Boolean(node.disabled);
        const option = { value: node.value ?? label, label, disabled, index: options.length };
        options.push(option);
        return option;
    };

    for (const node of Array.from(nodes)) {
        const tag = node.tagName.toLowerCase();
        if (tag === 'optgroup') {
            const group: ListGroup = { id: `g${groups.length}`, label: node.label, options: [] };
            for (const child of Array.from(node.children ?? [])) group.options.push(take(child, Boolean(node.disabled)));
            groups.push(group);
            loose = undefined;
        } else if (tag === 'option') {
            loose ??= { id: `g${groups.length}`, label: undefined, options: [] };
            if (!groups.includes(loose)) groups.push(loose);
            loose.options.push(take(node, false));
        }
    }
    return { options, groups };
}

const PAGE = 10;

function nearestEnabled(disabled: boolean[], from: number, step: 1 | -1): number {
    for (let i = from; i >= 0 && i < disabled.length; i += step) if (!disabled[i]) return i;
    return -1;
}

export type MoveKey = 'ArrowDown' | 'ArrowUp' | 'Home' | 'End' | 'PageDown' | 'PageUp';

/**
 * The next active index for a navigation key. Disabled options are skipped. The ends stop the
 * move for a listbox and wrap around for a menu (`wrap`).
 */
export function moveActive(disabled: boolean[], current: number, key: MoveKey, wrap = false): number {
    const last = disabled.length - 1;
    const found: Record<MoveKey, number> = {
        ArrowDown: nearestEnabled(disabled, current + 1, 1),
        ArrowUp: nearestEnabled(disabled, current - 1, -1),
        Home: nearestEnabled(disabled, 0, 1),
        End: nearestEnabled(disabled, last, -1),
        PageDown: nearestEnabled(disabled, Math.min(last, current + PAGE), -1),
        PageUp: nearestEnabled(disabled, Math.max(0, current - PAGE), 1)
    };
    if (current < 0 && (key === 'ArrowDown' || key === 'PageDown')) return nearestEnabled(disabled, 0, 1);
    if (current < 0 && key === 'ArrowUp') return nearestEnabled(disabled, last, -1);
    if (found[key] === -1 && wrap && key === 'ArrowDown') return nearestEnabled(disabled, 0, 1);
    if (found[key] === -1 && wrap && key === 'ArrowUp') return nearestEnabled(disabled, last, -1);
    return found[key] === -1 ? current : found[key];
}

export type TypeaheadResult = { buffer: string; index: number };

/**
 * Type-ahead. A growing buffer matches a label prefix, starting at the active option. Typing the
 * same letter again cycles through the options that start with it.
 */
export function typeahead(
    labels: string[],
    disabled: boolean[],
    current: number,
    buffer: string,
    char: string
): TypeaheadResult {
    const next = (buffer + char).toLowerCase();
    const cycling = [...next].every((c) => c === next[0]);
    const needle = cycling ? next[0] : next;
    const start = cycling ? current + 1 : Math.max(0, current);
    for (let step = 0; step < labels.length; step++) {
        const i = (start + step) % labels.length;
        if (!disabled[i] && labels[i].toLowerCase().startsWith(needle)) return { buffer: next, index: i };
    }
    return { buffer: next, index: -1 };
}

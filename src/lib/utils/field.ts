import { getContext, setContext } from 'svelte';

export type FieldContext = {
    id: string;
    describedBy: string | undefined;
    invalid: boolean;
};

const KEY = Symbol.for('fc.field');

/**
 * `Field` publishes the ids it generated; the form control below it picks them up.
 *
 * The alternative was making every caller thread ids through a snippet parameter, which
 * is explicit but taxes the common case — and the common case is `<Field label="Email">
 * <Input /></Field>`, which type-checks perfectly happily while producing an input with
 * no accessible name at all. A silent a11y failure that costs nothing to write is the
 * one you ship nineteen times. Context makes the correct thing the default; the snippet
 * parameters are still there for controls muse does not own.
 *
 * A getter rather than a plain object so the values stay reactive as `error` toggles.
 */
export function setFieldContext(read: () => FieldContext): void {
    setContext(KEY, read);
}

export function getFieldContext(): (() => FieldContext) | undefined {
    return getContext<(() => FieldContext) | undefined>(KEY);
}

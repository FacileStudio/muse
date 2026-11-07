import { getContext, setContext } from 'svelte';
import { DEFAULT_LOCALE, effectiveLocale, isKnownLocale, matchLocale, resolveLocale, type Locale } from './locale.js';
import { museMessages, type MuseMessages } from './messages/index.js';
import { createTranslator, type Translator } from './translate.js';

export interface I18n {
    readonly locale: Locale;
    /** False when `locale` is only the English fallback: no session, cookie or choice matched. */
    readonly known: boolean;
    set(locale: Locale): void;
    t: Translator<MuseMessages>;
}

export type LocaleSource = string | null | undefined | (() => string | null | undefined);

const KEY = Symbol.for('fc.i18n');

/**
 * A fixed-locale `I18n` with no context and no `<html lang>` effect: tests, emails, SSR helpers.
 * With no argument it is the unknown-locale English fallback.
 */
export function staticI18n(locale?: string | null): I18n {
    const fixed = resolveLocale(locale ?? DEFAULT_LOCALE);
    return {
        locale: fixed,
        known: matchLocale(locale) !== null,
        set: () => undefined,
        t: createTranslator(museMessages, fixed)
    };
}

/**
 * Sets the locale for every muse component below the calling component, and keeps
 * `<html lang>` in step with it. Call once, in the root layout, with the session's locale:
 * `provideLocale(() => data.session?.locale)`. On a page with no session, pass the
 * `LOCALE_COOKIE` value or the `Accept-Language` header instead. A getter follows the source
 * reactively; `set()` (what `LocaleSwitch` calls) overrides it until the page reloads.
 */
export function provideLocale(source: LocaleSource): I18n {
    const i18n = reactiveI18n(typeof source === 'function' ? source : () => source);
    setContext(KEY, i18n);
    $effect(() => {
        document.documentElement.lang = i18n.locale;
    });
    return i18n;
}

function reactiveI18n(read: () => string | null | undefined): I18n {
    const state = $state<{ chosen: Locale | null }>({ chosen: null });
    const i18n: I18n = {
        get locale() {
            return effectiveLocale(state.chosen, read);
        },
        get known() {
            return isKnownLocale(state.chosen, read);
        },
        set(locale) {
            state.chosen = resolveLocale(locale);
        },
        t: createTranslator(museMessages, () => i18n.locale)
    };
    return i18n;
}

let detached: I18n | undefined;

/**
 * The nearest `provideLocale` above the caller. With none above it (a root mounted apart from
 * the layout, an app that forgot the call) every caller shares one reactive English instance,
 * so `set()` still re-renders them all at once instead of being dropped.
 */
export function getI18n(): I18n {
    return getContext<I18n | undefined>(KEY) ?? (detached ??= reactiveI18n(() => null));
}

/**
 * Pins a subtree to one locale without touching `<html lang>`: a preview of another
 * language, or a block quoted in it. Put `lang={locale}` on the subtree's root element.
 */
export function scopeLocale(source: string | (() => string)): I18n {
    const raw = () => (typeof source === 'function' ? source() : source);
    const read = () => resolveLocale(raw());
    const i18n: I18n = {
        get locale() {
            return read();
        },
        get known() {
            return matchLocale(raw()) !== null;
        },
        set: () => undefined,
        t: createTranslator(museMessages, read)
    };
    setContext(KEY, i18n);
    return i18n;
}

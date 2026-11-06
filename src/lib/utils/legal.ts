import { matchLocale } from '../i18n/locale.js';
import { isSafeHref } from './href.js';

export const LEGAL_DOCS = ['cgu', 'cgv', 'privacy', 'legal-notice'] as const;

export type LegalDoc = (typeof LEGAL_DOCS)[number];

export const LEGAL_BASE = 'https://sso.facile.studio/legal';

const query = (locale: string | null | undefined): string => {
    const lang = matchLocale(locale);
    return lang ? `?${new URLSearchParams({ lang })}` : '';
};

/**
 * Registre's URL for one legal document. `?lang=` is added only for a supported locale;
 * without one, Registre picks from the browser's languages. An unsafe `base` falls back to Registre.
 */
export function legalUrl(doc: LegalDoc, locale?: string | null, base: string = LEGAL_BASE): string {
    const root = (isSafeHref(base) ? base : LEGAL_BASE).replace(/[?#].*$/, '').replace(/\/+$/, '');
    return `${root}/${encodeURIComponent(doc)}${query(locale)}`;
}

export const SIGNUP_URL = 'https://sso.facile.studio/signup';

/** Registre's sign-up page, with `?lang=` only for a supported locale. */
export function signUpUrl(locale?: string | null, base: string = SIGNUP_URL): string {
    const url = new URL(isSafeHref(base) && !base.startsWith('/') ? base : SIGNUP_URL);
    const lang = matchLocale(locale);
    if (lang) url.searchParams.set('lang', lang);
    return url.toString();
}

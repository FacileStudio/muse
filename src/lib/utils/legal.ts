import { resolveLocale } from '../i18n/locale.js';
import { isSafeHref } from './href.js';

export const LEGAL_DOCS = ['cgu', 'cgv', 'privacy', 'legal-notice'] as const;

export type LegalDoc = (typeof LEGAL_DOCS)[number];

export const LEGAL_BASE = 'https://sso.facile.studio/legal';

const query = (locale: string): string => new URLSearchParams({ lang: resolveLocale(locale) }).toString();

/** Registre's URL for one legal document in one language. An unsafe `base` falls back to Registre. */
export function legalUrl(doc: LegalDoc, locale: string, base: string = LEGAL_BASE): string {
    const root = (isSafeHref(base) ? base : LEGAL_BASE).replace(/[?#].*$/, '').replace(/\/+$/, '');
    return `${root}/${encodeURIComponent(doc)}?${query(locale)}`;
}

export const SIGNUP_URL = 'https://sso.facile.studio/signup';

/** Registre's sign-up page in one language. */
export function signUpUrl(locale: string, base: string = SIGNUP_URL): string {
    const url = new URL(isSafeHref(base) && !base.startsWith('/') ? base : SIGNUP_URL);
    url.searchParams.set('lang', resolveLocale(locale));
    return url.toString();
}

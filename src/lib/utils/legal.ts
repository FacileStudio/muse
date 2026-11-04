import type { Locale } from '../i18n/locale.js';

export const LEGAL_DOCS = ['cgu', 'cgv', 'privacy', 'legal-notice'] as const;

export type LegalDoc = (typeof LEGAL_DOCS)[number];

export const LEGAL_BASE = 'https://sso.facile.studio/legal';

/** Registre's URL for one legal document in one language. */
export function legalUrl(doc: LegalDoc, locale: Locale, base: string = LEGAL_BASE): string {
    return `${base.replace(/\/+$/, '')}/${doc}?lang=${locale}`;
}

export const SIGNUP_URL = 'https://sso.facile.studio/signup';

/** Registre's sign-up page in one language. */
export function signUpUrl(locale: Locale, base: string = SIGNUP_URL): string {
    const url = new URL(base);
    url.searchParams.set('lang', locale);
    return url.toString();
}

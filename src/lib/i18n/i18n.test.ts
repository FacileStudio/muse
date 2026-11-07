import { describe, expect, test } from 'bun:test';
import { LOCALES, effectiveLocale, isKnownLocale, matchLocale, resolveLocale } from './locale.js';
import { museMessages } from './messages/index.js';
import { createTranslator, type Message } from './translate.js';

const placeholders = (m: Message): string[] =>
    [...new Set((typeof m === 'string' ? [m] : Object.values(m)).join(' ').match(/\{\w+\}/g) ?? [])].sort();

describe('resolveLocale', () => {
    test('normalises regions and falls back to en', () => {
        expect(resolveLocale('fr-FR')).toBe('fr');
        expect(resolveLocale('DE')).toBe('de');
        expect(resolveLocale('es_MX')).toBe('es');
        expect(resolveLocale('it')).toBe('en');
        expect(resolveLocale(undefined)).toBe('en');
    });

    test('reads every Accept-Language tag by q, not only the first', () => {
        expect(resolveLocale('it-IT,it;q=0.9,de;q=0.8,en;q=0.7')).toBe('de');
        expect(resolveLocale('en;q=0.2, fr;q=0.9')).toBe('fr');
        expect(resolveLocale('es;q=0, de')).toBe('de');
        expect(resolveLocale('es-419, fr')).toBe('es');
        expect(matchLocale('it, pt')).toBeNull();
        expect(matchLocale('')).toBeNull();
    });
});

describe('translate', () => {
    const catalogs = {
        en: { hi: 'Hi {name}', files: { one: '{count} file', other: '{count} files' } },
        fr: { hi: 'Salut {name}', files: { one: '{count} fichier', other: '{count} fichiers' } },
        es: { hi: 'Hola {name}', files: { one: '{count} archivo', other: '{count} archivos' } },
        de: { hi: 'Hallo {name}', files: { one: '{count} Datei', other: '{count} Dateien' } }
    };

    test('interpolates and pluralises per locale', () => {
        const fr = createTranslator(catalogs, 'fr');
        const en = createTranslator(catalogs, 'en');
        expect(fr('hi', { name: 'Ana' })).toBe('Salut Ana');
        expect(fr('files', { count: 0 })).toBe('0 fichier');
        expect(en('files', { count: 0 })).toBe('0 files');
        expect(en('files', { count: 1 })).toBe('1 file');
        expect(createTranslator(catalogs, 'de')('files', { count: 1200 })).toBe('1.200 Dateien');
    });

    test('follows a locale getter', () => {
        let locale: 'en' | 'es' = 'en';
        const t = createTranslator(catalogs, () => locale);
        expect(t('hi', { name: 'Bo' })).toBe('Hi Bo');
        locale = 'es';
        expect(t('hi', { name: 'Bo' })).toBe('Hola Bo');
    });

    test('a missing entry falls back to English', () => {
        const partial = { ...catalogs, de: { files: catalogs.de.files } } as unknown as typeof catalogs;
        expect(createTranslator(partial, 'de')('hi', { name: 'Jo' })).toBe('Hi Jo');
    });
});

describe('muse catalogs', () => {
    const keys = Object.keys(museMessages.en).sort();

    test('every locale has every key and the same placeholders', () => {
        for (const locale of LOCALES) {
            const catalog = museMessages[locale] as Record<string, Message>;
            expect(Object.keys(catalog).sort()).toEqual(keys);
            for (const key of keys) {
                expect(`${locale}:${key}:${placeholders(catalog[key])}`).toBe(
                    `${locale}:${key}:${placeholders(museMessages.en[key as keyof typeof museMessages.en])}`
                );
            }
        }
    });

    test('French puts a non-breaking space before : ? ! ;', () => {
        const strings = Object.values(museMessages.fr).flatMap((m) => (typeof m === 'string' ? [m] : Object.values(m)));
        const bad = strings.filter((m) => /(^|[^\u00a0\u202f])[:?!;]/.test(m));
        expect(bad).toEqual([]);
    });

    test('upload.complete agrees with the done count', () => {
        const fr = createTranslator(museMessages, 'fr');
        expect(fr('upload.complete', { count: 1, total: 3 })).toBe('1 sur 3 terminé');
        expect(fr('upload.complete', { count: 2, total: 3 })).toBe('2 sur 3 terminés');
        expect(createTranslator(museMessages, 'es')('upload.complete', { count: 1, total: 2 })).toBe('1 de 2 completado');
    });

    test('the sign-in button says the canonical sentence', () => {
        expect(LOCALES.map((l) => museMessages[l]['signIn.label'])).toEqual([
            'Se connecter avec Facile',
            'Sign in with Facile',
            'Iniciar sesión con Facile',
            'Mit Facile anmelden'
        ]);
    });
});

describe('effectiveLocale', () => {
    test('a choice beats the source and the source is re-read after it is gone', () => {
        let session: string | null = 'de';
        const source = () => session;
        expect(effectiveLocale(null, source)).toBe('de');
        expect(effectiveLocale('fr', source)).toBe('fr');
        session = 'es';
        expect(effectiveLocale(null, source)).toBe('es');
        session = null;
        expect(effectiveLocale(null, source)).toBe('en');
    });

    test('a choice is not read from the source at all', () => {
        const source = () => {
            throw new Error('read');
        };
        expect(effectiveLocale('fr', source)).toBe('fr');
        expect(isKnownLocale('fr', source)).toBe(true);
    });

    test('known is false only for the English fallback', () => {
        expect(isKnownLocale(null, () => 'it')).toBe(false);
        expect(isKnownLocale(null, () => 'de-AT')).toBe(true);
        expect(isKnownLocale('en', () => null)).toBe(true);
    });

    test('a translator over a getter follows every change at once', () => {
        let locale: 'fr' | 'en' = 'en';
        const t = createTranslator({ en: { hi: 'Hi' }, fr: { hi: 'Salut' }, es: { hi: 'Hola' }, de: { hi: 'Hallo' } }, () => effectiveLocale(null, () => locale));
        expect(t('hi')).toBe('Hi');
        locale = 'fr';
        expect(t('hi')).toBe('Salut');
    });
});

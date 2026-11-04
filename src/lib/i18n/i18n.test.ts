import { describe, expect, test } from 'bun:test';
import { LOCALES, resolveLocale } from './locale.js';
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

    test('the sign-in button says the canonical sentence', () => {
        expect(LOCALES.map((l) => museMessages[l]['signIn.label'])).toEqual([
            'Se connecter avec Facile',
            'Sign in with Facile',
            'Iniciar sesión con Facile',
            'Mit Facile anmelden'
        ]);
    });
});

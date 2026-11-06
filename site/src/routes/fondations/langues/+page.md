<script lang="ts">
    import Example from '$lib/prose/Example.svelte';
    import Locales from '$lib/examples/SignInWithFacile/locales.svelte';
    import source from '$lib/examples/SignInWithFacile/locales.svelte?raw';
</script>

# Langues

La suite parle français, anglais, espagnol et allemand (`fr`, `en`, `es`, `de`). muse porte un
petit moteur de messages sans dépendance : catalogues typés, interpolation `{nom}`, pluriels
par `Intl.PluralRules`, repli sur l'anglais. Chaque texte des composants muse en passe par lui.

## Brancher la langue, une fois

Dans le layout racine, avec la langue de la session :

```svelte
<script lang="ts">
    import { provideLocale } from '@facile/muse';

    let { data, children } = $props();

    provideLocale(() => data.session?.locale);
</script>
```

`provideLocale` normalise la valeur (`fr-FR` devient `fr`, une langue inconnue devient `en`),
la publie en contexte pour tous les composants muse en dessous, et tient `<html lang>` à jour
côté client. Pour que le HTML rendu par le serveur ait déjà le bon `lang`, mettez
`<html lang="%lang%">` dans `app.html` et remplacez-le dans `hooks.server.ts` :

```ts
import { resolveLocale } from '@facile/muse';

export const handle = ({ event, resolve }) =>
    resolve(event, {
        transformPageChunk: ({ html }) => html.replace('%lang%', resolveLocale(event.locals.session?.locale))
    });
```

## Pages sans session

La page de connexion n'a pas de session. Passez alors le cookie de langue, puis l'en-tête
`Accept-Language` : `resolveLocale` lit toutes les langues de l'en-tête, par ordre de `q`.

```ts
// +layout.server.ts
import { LOCALE_COOKIE } from '@facile/muse';

export const load = ({ locals, cookies, request }) => ({
    locale: locals.session?.locale ?? cookies.get(LOCALE_COOKIE) ?? request.headers.get('accept-language')
});
```

```svelte
provideLocale(() => data.locale);
```

Quand aucune langue n'est connue (`getI18n().known` est faux), muse affiche l'anglais mais
n'ajoute pas `?lang=` aux liens Registre : Registre choisit alors d'après le navigateur.

## Garder la langue choisie

`AuthScreen` reçoit `onLocaleChange` : enregistrez-y le choix, dans `LOCALE_COOKIE`, pour que
la prochaine page sans session parte dans la bonne langue. Le bouton de connexion transmet
déjà la langue à porte dans `ui_locales` (le paramètre OIDC standard), pour que l'écran de
Registre et la session qui en sort la reprennent.

```svelte
<AuthScreen
    appName="Sablier"
    onLocaleChange={(l) => (document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`)}
/>
```

## Les textes de l'app

Le même moteur sert aux catalogues de l'app. TypeScript exige que les quatre langues aient
toutes les clés :

```ts
import { createTranslator, getI18n, type Catalogs } from '@facile/muse';

const messages = {
    en: { title: 'Projects', count: { one: '{count} project', other: '{count} projects' } },
    fr: { title: 'Projets', count: { one: '{count} projet', other: '{count} projets' } },
    es: { title: 'Proyectos', count: { one: '{count} proyecto', other: '{count} proyectos' } },
    de: { title: 'Projekte', count: { one: '{count} Projekt', other: '{count} Projekte' } }
} satisfies Catalogs<{ title: string; count: { one: string; other: string } }>;

const i18n = getI18n();
const t = createTranslator(messages, () => i18n.locale);
```

`t('count', { count: 3 })` choisit la forme plurielle et formate le nombre selon la langue.

## Changer de langue

`LocaleSwitch` liste les quatre langues dans leur propre langue. Il change la langue de muse
tout de suite ; `onChange` sert à l'enregistrer (profil Registre, cookie). Un `onchange` natif
est appelé en plus, pas à la place. `LegalFooter` l'inclut.

## Un bloc dans une autre langue

`scopeLocale(locale)` fixe la langue d'un sous-arbre sans toucher `<html lang>`. Mettez
`lang={locale}` sur son élément racine.

<Example component={Locales} {source} />

## Ce qu'il faut savoir

- Les props de texte gagnent toujours : `confirmLabel`, `emptyLabel`, `label`… Le catalogue ne
  sert que quand elles sont absentes.
- Sans `provideLocale`, muse parle anglais.
- Les traductions espagnoles et allemandes attendent une relecture native (`TRANSLATIONS.md`).

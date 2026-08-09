# Installer

```sh
bun add "github:FacileStudio/muse#v0.6.0"
```

**Épinglez un tag.** Suivre la branche par défaut veut dire qu'une poussée sur la bibliothèque
change silencieusement le build d'une app sans rapport. Boutique l'a appris : sans tag et sans
lockfile à jour, son build Docker prenait ce que `main` pointait à la minute près.

## Trois branchements, et les trois sont nécessaires

**1. La feuille de style.**

```css
@import '@facile/muse/styles';
@source '../node_modules/@facile/muse/src';
```

`tokens.css` importe Tailwind lui-même, donc **n'importez pas `tailwindcss` une seconde fois**.
Le `@source` n'est pas optionnel : Tailwind v4 ne scanne pas `node_modules`, donc sans lui
chaque classe muse est purgée et les composants rendent une structure correcte et
complètement non stylée. L'échec n'apparaît que dans le CSS compilé — aucun contrôle ne
l'attrape.

**2. L'optimiseur de dépendances.**

```ts
optimizeDeps: { exclude: ['@facile/muse'] }
```

muse livre du source non compilé, y compris des modules `.svelte.ts`. L'optimiseur de Vite les
passe à esbuild sans transformation TypeScript et le serveur de dev meurt. `vite build` ne fait
jamais tourner l'optimiseur, donc le build, le typecheck et la CI restent verts pendant que le
dev est complètement cassé.

**3. L'élément `<iconify-icon>`.**

```ts
if (browser) void import('iconify-icon');
```

`iconify-icon` n'est pas une dépendance de muse. Treize composants rendent des
`<iconify-icon>` qui restent inertes tant que le consommateur n'a pas enregistré l'élément
personnalisé. Échec silencieux : aucune icône, aucune erreur.

## Le lockfile fait partie de l'épinglage

Changer `package.json` sans régénérer le lockfile fait échouer le build Docker d'un
consommateur qui tourne `bun install --frozen-lockfile`. Le déploiement plante et la production
continue à servir l'image précédente. **Bumpez l'épingle et le lockfile dans le même commit.**

## Monter de version

Lisez [`MIGRATION.md`](https://github.com/FacileStudio/muse/blob/main/MIGRATION.md). Il est
écrit au fil des changements, pas reconstruit après coup : chaque entrée dit ce qui casse,
comment ça se manifeste, et quoi faire.

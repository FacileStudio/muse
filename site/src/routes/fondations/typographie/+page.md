# Typographie

**muse n'embarque aucune police, et en réintroduire une est une décision sous contrôle.**

Jusqu'à la v0.5.0, la bibliothèque livrait la coupe *d'essai* de Goga : 68 points de code,
couvrant ` !,-.0123456789?A-Za-z` et rien d'autre. Pas d'accents, pas d'apostrophe, pas de
deux-points, pas de `%`, pas de `€`.

Dans une suite francophone, chaque caractère accentué basculait sur Helvetica **au milieu du
mot**, avec une autre graisse et une autre hauteur d'x. Comme chaque heure (`09:30` — Sablier
est un suivi de temps), chaque pourcentage, et les `••••••••` qui masquent les secrets sur
toutes les pages de réglages.

Personne ne l'avait vu parce que la demo et le harnais de smoke sont écrits en anglais sans
ponctuation. **Un corpus de test qui évite l'alphabet du produit est aveugle à ce genre de
défaut.**

`fonts.test.ts` parse maintenant la table cmap de tout fichier déposé dans `src/lib/fonts/` et
casse le build sur une police incapable de rendre ce que la suite tape.

## La pile actuelle

| Rôle | Token |
|---|---|
| Corps | `--font-fc-body` — pile système |
| Titres | `--font-fc-title` — même pile |
| Machine | `--font-fc-mono` — pile plateforme |

`--font-fc-title` reste un token distinct exprès : c'est la couture par laquelle une police de
titrage sous licence peut revenir sur les titres seuls, sans toucher au corps de texte.

Le mono est réservé aux **chaînes machine** : secrets, clés d'API, identifiants, points de
terminaison, noms de canaux d'événements. La prose ne le porte jamais.

## L'échelle

`text-fc-xs` · `sm` · `md` · `lg` · `xl` · `2xl` · `3xl`, chacune avec sa hauteur de ligne
appariée. Deux graisses : `font-medium` et `font-semibold`. N'allez pas chercher `font-bold`.

# Typographie

**muse nomme Magnetik mais ne l'embarque pas.** Le dépôt est public et Magnetik est une police
commerciale : chaque app déclare son propre `@font-face` (Regular 400 et Medium 500). Sans lui,
le texte retombe sur la pile système.

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
| Corps | `--font-fc-body` — Magnetik, puis la pile système |
| Titres | `--font-fc-title` — même pile |
| Machine | `--font-fc-mono` — pile plateforme |

`--font-fc-title` reste un token distinct exprès : c'est la couture par laquelle une police de
titrage sous licence peut revenir sur les titres seuls, sans toucher au corps de texte.

Le mono est réservé aux **chaînes machine** : secrets, clés d'API, identifiants, points de
terminaison, noms de canaux d'événements. La prose ne le porte jamais.

## L'échelle

Cinq styles, et aucun autre. Chacun fixe la taille, une hauteur de ligne de 130 % et un
interlettrage de -2 % (`-0.02em`).

| Style | Taille | Usage |
|---|---|---|
| `text-fc-title` | 32px, medium | titres de page, valeurs de stat |
| `text-fc-subtitle` | 24px | titres de section |
| `text-fc-lead` | 18px | chapôs, titres de carte, champs de formulaire |
| `text-fc-p` | 14px | **corps et UI par défaut** |
| `text-fc-subtext` | 11px | méta, badges, aides |

Les champs sont en `lead` : sous 16px, Safari iOS zoome la page au focus.

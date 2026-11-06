# Couleur

**La palette Tailwind n'existe pas ici.** `tokens.css` réinitialise l'espace de noms
`--color-*`, donc `bg-red-500` et `text-slate-700` ne génèrent aucun CSS. Une couleur hors
système n'est pas une règle à retenir : c'est une classe qui ne produit rien.

Mesuré avant d'activer la coupe : douze des treize apps consommatrices utilisaient déjà **zéro**
utilitaire de la palette stock. Seule Agenda en avait treize, tous des restes de shadcn.

Survivent quatre primitives neutres — `white`, `black`, `transparent`, `current` — parce que ce
sont des primitives et non des choix de palette : un voile, `text-white` sur une pastille,
`currentColor` qui suit l'encre.

## Chroma zéro

La palette est en OKLCH et **entièrement grise**, sauf six tokens sémantiques : `fc-danger`,
`fc-success`, `fc-info`, `fc-warning`, `fc-owner`, `fc-admin`, plus les six emplacements de
séries de graphiques.

| Rôle | Token |
|---|---|
| Canevas du document | `bg-fc-page` |
| Remplissage propre d'un composant | `bg-fc-bg` |
| Surface enfoncée | `bg-fc-surface` |
| Surface de conteneur | `bg-fc-component` |
| Encre | `text-fc-fg`, `text-fc-fg-muted` |
| Accent | `bg-fc-accent` / `text-fc-accent-fg` |
| Remplissage d'un contrôle de formulaire (une marche au-dessus de la surface) | `bg-fc-field`, `text-fc-fg-muted` |
| Anneau de focus | `outline-fc-ring` |

## Inversé, jamais teinté

Un état actif **inverse** : `bg-fc-accent` vaut la couleur de premier plan, donc un élément
sélectionné se lit comme un pavé inversé. Il ne se teinte pas d'une nuance de la couleur de
marque. C'est la règle qui donne à la suite son aspect, et c'est celle qu'un agent enfreint en
premier en atteignant un `bg-primary/10`.

Corollaire : le survol d'une carte cliquable **monte** vers `fc-surface`. Il ne s'assombrit pas.

## Pas de bordure

Muse ne dessine aucune bordure. La séparation vient des **fonds**, de l'**espace** et, sur les surfaces
flottantes seulement, d'une **ombre**. Ni `border`, ni `divide-*`, ni `ring` : ni sur une carte, un
panneau, une liste, un tableau, un séparateur, un menu, un toast, une modale, ni sur un champ.

- Un conteneur prend `bg-fc-component` sur `bg-fc-page`.
- Un plateau à l'intérieur d'une carte prend `bg-fc-surface`.
- Les lignes d'une liste se séparent par leur padding vertical, un tableau alterne ses fonds.
- Une surface flottante prend un fond opaque et `shadow-lg`.
- Un contrôle de formulaire n'a que son fond, un aplat léger `bg-fc-field` (environ 1,2:1 contre la
  surface). Le propriétaire a préféré cela au contraste de 3:1 de WCAG 2.2 (1.4.11) : le champ est
  identifié par son **libellé** (obligatoire, visible), son placeholder et l'anneau de focus, et le
  texte reste à plus de 4,5:1. En contraste élevé Windows (`forced-colors`), une bordure système est
  rétablie. Cases et boutons radio sont des aplats inversés en accent une fois cochés, avec un tracé
  SVG ; un champ invalide mêle du rouge à son fond et `Field` ajoute une icône et le message.
- Le focus reste l'unique anneau, un `outline`, jamais une bordure.

`no-borders.test.ts` fait échouer le build sur toute bordure, tout `divide-*`, tout `ring` et tout
`outline` hors focus dans `src/lib/components`. Seuls `border-0` et `border-none` passent.

## Le mode sombre a une moitié que les tokens n'atteignent pas

`color-scheme` doit être déclaré, dans les deux blocs. Les propriétés personnalisées ne
touchent que ce que *vous* peignez : le navigateur peint le sélecteur de date, les barres de défilement système
et l'intérieur des contrôles de formulaire, le fond de l'autocomplétion, le caret, la
sélection de texte et le canevas au-delà du fond de page. Tout cela reste clair sans
`color-scheme: dark`, sur une page par ailleurs entièrement sombre.

**Basculez les deux classes.** Le bloc sombre est peint depuis une media query scopée
`:root:not(.light)` plus un jumeau `:root.dark`. Une app dont le sélecteur de thème n'ajoute
que `dark` ne peut donc pas afficher le mode clair sur un OS sombre : la media query gagne
encore.

## Graphiques

`fc-chart-1` … `fc-chart-6` — violet, orange, aqua, rouge, vert, rose. C'est la palette
d'identité de Sablier avec les teintes conservées et la luminosité approfondie : les originales
sont correctes en pastilles d'avatar et très en dessous du seuil de contraste de 3:1 en marques
de graphique.

**L'ordre est porteur.** Le jeu comporte trois teintes chaudes qui s'effondrent sous
protanopie, donc aucun ordre ne passe sur la teinte seule : la palette s'appuie sur un
échelonnement de luminosité et au moins 120° entre voisines.

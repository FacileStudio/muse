# Couleur

**La palette Tailwind n'existe pas ici.** `tokens.css` réinitialise l'espace de noms
`--color-*`, donc `bg-red-500` et `text-slate-700` ne génèrent aucun CSS. Une couleur hors
système n'est pas une règle à retenir : c'est une classe qui ne produit rien.

Mesuré avant d'activer la coupe : douze des treize apps consommatrices utilisaient déjà **zéro**
utilitaire de la palette stock. Seule Agenda en avait treize, tous des restes de shadcn.

Survivent quatre primitives neutres — `white`, `black`, `transparent`, `current` — parce que ce
sont des primitives et non des choix de palette : un voile, `border-transparent` sur un badge,
`border-current` qui suit l'encre.

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
| Bordure d'un contrôle de formulaire, anneau de focus | `border-fc-border`, `outline-fc-ring` |

## Inversé, jamais teinté

Un état actif **inverse** : `bg-fc-accent` vaut la couleur de premier plan, donc un élément
sélectionné se lit comme un pavé inversé. Il ne se teinte pas d'une nuance de la couleur de
marque. C'est la règle qui donne à la suite son aspect, et c'est celle qu'un agent enfreint en
premier en atteignant un `bg-primary/10`.

Corollaire : le survol d'une carte cliquable **monte** vers `fc-surface`. Il ne s'assombrit pas.

## Pas de bordure décorative

Les surfaces se séparent par leur **fond** et par l'**espace**, jamais par un trait. Une carte,
une section, un panneau, une liste, un en-tête, une barre latérale, une modale, un tiroir, un
menu ou un toast ne portent ni `border`, ni `divide-*`, ni `ring` ou `outline` décoratif.

- Un conteneur prend `bg-fc-component` sur `bg-fc-page`.
- Un plateau à l'intérieur d'une carte prend `bg-fc-surface`.
- Les lignes d'une liste se séparent par leur padding vertical.
- Une surface flottante prend un fond opaque et `shadow-lg`.

Une bordure reste là où elle porte un sens : les contrôles de formulaire, le pointillé de
`Dropzone`, les filets de ligne d'un `Table`, un `Divider` posé exprès, et l'anneau de focus.
`no-decorative-border.test.ts` fait échouer le build sur toute autre bordure dans muse.

## Le mode sombre a une moitié que les tokens n'atteignent pas

`color-scheme` doit être déclaré, dans les deux blocs. Les propriétés personnalisées ne
touchent que ce que *vous* peignez : le navigateur peint le menu déroulant d'un `<select>`
natif, l'intérieur des contrôles de formulaire, le fond de l'autocomplétion, le caret, la
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

<script lang="ts">
    import Example from '$lib/prose/Example.svelte';
    import Full from '$lib/examples/archetype-detail/full.svelte';
    import source from '$lib/examples/archetype-detail/full.svelte?raw';
</script>

# Archétype : détail de ressource

Ce qu'on obtient en cliquant une ligne d'un [index](/archetypes/index). Un en-tête pleine
largeur, puis deux colonnes : ce qu'on est venu lire à gauche, ce qui décrit l'objet à droite.

## Utilisez-le quand

- Un objet unique a plus de contenu qu'une ligne de tableau : un projet, un membre, un
  document, un espace.
- Il faut à la fois du contenu qui se parcourt et des métadonnées qui se consultent.
- L'objet porte des actions qui lui sont propres — modifier, archiver, partager.

## La recette

<Example component={Full} {source} />

## Ce qu'il faut savoir

- **2/3 – 1/3**, pas 50/50. Une colonne secondaire à moitié de la page attire autant l'œil que
  la principale, et la page n'a alors plus de sujet.
- L'en-tête reste **pleine largeur au-dessus de la grille**. Un titre confiné dans la colonne
  de gauche fait démarrer la page à sa moitié.
- La grille s'effondre en une seule colonne sous `lg`, et l'ordre du DOM est déjà le bon :
  principal d'abord, métadonnées ensuite. C'est la raison pour laquelle on n'inverse pas les
  deux colonnes en markup.
- Le lien retour est la prop `back` du `PageHeader`, jamais un bouton posé à la main : il
  annule son propre padding avec `-ml-3` pour aligner le texte sur le bord de la page, et
  quatre apps avaient chacune trouvé une valeur différente.
- Chaque colonne est une `Stack gap="content"`, pas des `Section` posées côte à côte. La grille
  possède la gouttière, la pile possède l'espace vertical — aucune carte ne porte de marge.

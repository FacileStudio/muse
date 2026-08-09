<script lang="ts">
    import Example from '$lib/prose/Example.svelte';
    import Full from '$lib/examples/archetype-index/full.svelte';
    import source from '$lib/examples/archetype-index/full.svelte?raw';
</script>

# Archétype : index de ressource

La liste de tout ce qui est d'un même type : les projets, les membres, les fichiers, les clés
d'API. C'est la page la plus copiée de la suite, et celle où les divergences coûtent le plus
cher — un utilisateur apprend un index et s'attend à retrouver le même partout.

## Utilisez-le quand

- Une collection qu'on parcourt, filtre et dans laquelle on entre.
- Une page qui a une action primaire évidente : créer, inviter, téléverser.
- Un onglet de réglages qui liste des objets — membres, jetons, intégrations.

## La recette

<Example component={Full} {source} />

## Ce qu'il faut savoir

- L'action primaire vit dans le snippet `actions` du `PageHeader`, jamais au-dessus du
  tableau. Elle reste au même endroit quand la liste est vide, et l'état vide n'a alors plus
  à la reproduire.
- La barre de filtres est à `gap-2` — `tight`, des contrôles utilisés ensemble — puis
  `content` la sépare du tableau. Deux relations différentes, deux barreaux différents.
- Le bouton de la barre de filtres prend `size="lg"`. `Input` et `Select` sont en `h-11`, le
  bouton par défaut en `h-9` : 8px d'écart sur la même ligne se lit comme un bug.
- L'état vide **est** une réponse, pas une erreur : « aucun projet ne correspond » avec un
  bouton de réinitialisation, et non le message d'accueil du premier lancement. Ce sont deux
  textes distincts pour deux situations distinctes.
- `Table` porte déjà `overflow-x-auto` et le style de ses cellules. N'enveloppez pas un tableau
  dans une `Card` : vous obtenez un conteneur dans un conteneur, à 20px du bord pour rien.

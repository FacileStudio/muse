<script lang="ts">
    import Example from '$lib/prose/Example.svelte';
    import Full from '$lib/examples/archetype-tableau-de-bord/full.svelte';
    import source from '$lib/examples/archetype-tableau-de-bord/full.svelte?raw';
</script>

# Archétype : tableau de bord

La première page après la connexion. Elle répond à une seule question — « qu'est-ce qui a
changé depuis la dernière fois » — et tout ce qui n'y répond pas appartient à une autre page.

## Utilisez-le quand

- L'écran d'accueil d'une app : Sablier, Vision, Nuage en ont tous un.
- Une vue d'espace qui résume plusieurs ressources sans permettre de les modifier.
- Un rapport périodique : semaine, mois, exercice.

**Pas** pour une liste. Un tableau de bord qui finit par un tableau de vingt lignes est un
[index](/archetypes/index) avec des statistiques en chapeau.

## La recette

<Example component={Full} {source} />

## Ce qu'il faut savoir

- `width="xl"` (1200px) est la seule page qui le mérite : quatre cartes statistiques sous
  960px tombent à deux colonnes, et la comparaison qui justifiait la rangée disparaît.
- La rangée de statistiques n'est pas une `Section` — elle n'a pas de titre parce qu'elle en
  est un. Un `h2` « Vue d'ensemble » au-dessus de quatre chiffres ne dit rien de plus.
- La gouttière est `gap-4`, jamais moins : `Card` est à `p-5`, et une gouttière plus serrée
  que le padding des cartes soude la rangée en un seul panneau à coutures.
- Les 40px entre sections viennent du `gap` de `Page`, pas d'une marge sur les sections —
  c'est ce qui rend le rythme identique d'une app à l'autre.
- **Aucune couleur n'est passée aux graphiques.** `LineChart`, `BarChart` et `DonutChart`
  dérivent leur palette du thème ; une couleur codée en dur survit au mode sombre par accident,
  pas par conception.

<script lang="ts">
    import Example from '$lib/prose/Example.svelte';
    import Full from '$lib/examples/archetype-formulaire/full.svelte';
    import source from '$lib/examples/archetype-formulaire/full.svelte?raw';
</script>

# Archétype : formulaire

Une page dont le seul but est de recueillir une saisie. Une colonne, des groupes nommés, une
ligne de validation en bas. Rien à droite : une colonne secondaire à côté d'un formulaire est
une invitation à quitter le formulaire.

## Utilisez-le quand

- Créer ou modifier une ressource qui ne tient pas dans une modale — plus de trois ou quatre
  champs, ou une saisie qu'on veut pouvoir recharger par son URL.
- Un onboarding, une configuration initiale, une demande.
- **Pas** pour des réglages : ceux-là sont des lignes qui s'enregistrent seules, et ils ont
  leur propre archétype — [réglages](/structure/reglages).

## La recette

<Example component={Full} {source} />

## Ce qu'il faut savoir

- `width="md"` (720px). La largeur par défaut de `lg` étire une étiquette au-dessus d'un champ
  de 960px de large, et l'œil perd la relation entre les deux.
- Les champs d'un même groupe sont à `content` (16px) ; les groupes sont séparés par le `gap`
  de `Page`, soit `section` (40px). Le rapport de 2,5 est ce qui fait lire les groupes comme
  des groupes — un écart de 16 contre 24 ne se voit pas.
- Un champ, c'est `Field` : il possède l'étiquette, l'aide et l'erreur, et il relie les trois au
  contrôle par `id` et `aria-describedby`. Une étiquette écrite à la main pointe vers rien.
- L'aide est permanente, l'erreur la remplace. Empiler les deux fait sauter la page à chaque
  frappe et pousse le bouton de validation hors de vue.
- La ligne de validation prend `size="lg"` : c'est la cible tactile principale de la page, et
  c'est l'exception documentée au `h-9` par défaut du bouton. Le primaire est à droite, derrière
  l'annulation, dans le sens de lecture.

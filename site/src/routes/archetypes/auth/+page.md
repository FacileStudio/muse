<script lang="ts">
    import Example from '$lib/prose/Example.svelte';
    import Full from '$lib/examples/archetype-auth/full.svelte';
    import source from '$lib/examples/archetype-auth/full.svelte?raw';
</script>

# Archétype : interstitiel d'authentification

Les pages hors de la coquille : connexion, retour de SSO, session expirée. Pas de rail, pas de
nav mobile, une seule colonne étroite centrée. C'est le seul archétype où l'utilisateur n'a
qu'une chose à faire, et la mise en page doit le dire.

## Utilisez-le quand

- Se connecter, ou choisir entre mot de passe local et SSO.
- Le retour de `/auth/oidc/callback` : un `Spinner` et une phrase, rien d'autre.
- Session expirée, lien d'invitation périmé, accès refusé.

## La recette

<Example component={Full} {source} />

## Ce qu'il faut savoir

- ~360px, pas la largeur d'une page. `Page width="sm"` plafonne à 600px, ce qui reste large
  pour deux champs : la colonne interne est bornée à `max-w-[360px]`, la largeur au-delà de
  laquelle un formulaire de connexion se met à ressembler à une page de réglages.
- **Le bloc d'erreur vit en dehors de toute condition `SSO_ONLY`.** Depuis porte v0.2.4, un
  échec de connexion est une redirection vers la page de login avec la raison dans le paramètre
  `error` — un déploiement en SSO seul est justement celui qui ne peut produire que cette
  erreur, et c'est celui qui n'affichait rien.
- Un refus et un succès sont **tous les deux un 302**. Ce qui distingue les deux est le
  `Location`, pas le code : ne branchez pas l'affichage sur le statut.
- Le bouton SSO est le primaire et il est au-dessus des champs. L'objectif de la suite est
  `SSO_ONLY=true` partout ; l'ordre visuel doit précéder le basculement, pas le suivre. Il porte
  `rel="external"` parce que `/auth/oidc` est une route serveur : une navigation côté client ne
  la joindrait jamais.
- Tous les boutons sont en `size="lg"` : un interstitiel se traverse aussi souvent au pouce
  qu'à la souris, et il n'y a ici aucune densité à préserver.

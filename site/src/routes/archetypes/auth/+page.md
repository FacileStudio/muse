<script lang="ts">
    import Example from '$lib/prose/Example.svelte';
    import Full from '$lib/examples/archetype-auth/full.svelte';
    import source from '$lib/examples/archetype-auth/full.svelte?raw';
</script>

# Archétype : interstitiel d'authentification

Les pages hors de la coquille : connexion, retour de SSO, session expirée. Pas de rail, pas de
nav mobile, une seule carte centrée. C'est le seul archétype où l'utilisateur n'a qu'une chose à
faire, et la mise en page doit le dire.

## Utilisez-le quand

- Se connecter : `AuthScreen`, et rien d'autre.
- Le retour de `/auth/oidc/callback` : un `Spinner` et une phrase.
- Session expirée, lien d'invitation périmé, accès refusé : le même écran, avec un `Alert` dans
  le snippet `notice`.

## La recette

<Example component={Full} {source} />

## Ce qu'il faut savoir

- **Aucun champ de mot de passe, nulle part.** Les comptes vivent dans Registre ; une app ne
  propose que « Se connecter avec Facile » et le lien « Créer votre compte » vers l'inscription
  Registre (`signUpHref`, par défaut `https://sso.facile.studio/signup?lang=<langue>`).
- `SignInWithFacile` porte `rel="external"` et `data-sveltekit-reload` : `/auth/oidc` est une
  route serveur, une navigation côté client ne la joindrait jamais.
- **Le bloc d'erreur vit dans `notice`, toujours affiché.** Depuis porte v0.2.4, un échec de
  connexion redirige vers la page de login avec la raison dans le paramètre `error`.
- Un refus et un succès sont **tous les deux un 302**. Ce qui distingue les deux est le
  `Location`, pas le code : ne branchez pas l'affichage sur le statut.
- La carte est bornée à 360px et l'entrée honore `prefers-reduced-motion`. Le pied légal et le
  choix de langue sont en bas de l'écran, hors de la carte.

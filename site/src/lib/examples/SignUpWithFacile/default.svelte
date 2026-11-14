<!--
    Sans `href`, le bouton mène à `https://sso.facile.studio/signup`, avec `?lang=` quand la langue
    est connue. Registre n'a pas d'entrée d'inscription par la route porte de l'app : une fois le
    compte créé, la personne est connectée sur Registre, et « Se connecter avec Facile » dans l'app
    passe ensuite sans mot de passe.
-->
<script lang="ts">
    import { SignUpWithFacile } from '@facile/muse';
</script>

<SignUpWithFacile size="lg" />

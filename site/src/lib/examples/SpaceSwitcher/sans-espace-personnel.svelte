<!--
    Une application dont toute donnée appartient à un espace passe `personalLabel={null}` :
    la ligne personnelle disparaît et `onSelect` ne reçoit jamais `null`. Attention, un
    `undefined` explicite ne suffit pas — Svelte le résout vers la valeur par défaut.

    Sans espace, le composant ne rend rien du tout : une seule entrée n'est pas un choix.
-->
<script lang="ts">
    import { SpaceSwitcher } from '@facile/muse';

    let espace = $state('heranova');
</script>

<SpaceSwitcher
    class="w-64"
    personalLabel={null}
    activeId={espace}
    onSelect={(id) => id && (espace = id)}
    spaces={[
        { id: 'heranova', name: 'Heranova' },
        { id: 'lpb', name: 'La Petite Boulangerie' }
    ]}
/>

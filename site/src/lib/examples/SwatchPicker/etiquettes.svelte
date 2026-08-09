<script lang="ts">
    import { Stack, SwatchPicker } from '@facile/muse';

    let couleur = $state('#EEB47E');
</script>

<Stack gap="bound">
    <span class="text-fc-sm text-fc-fg">Couleur affichée à côté de votre nom</span>
    <SwatchPicker showLabels label="Couleur d'identité" bind:value={couleur} />
</Stack>

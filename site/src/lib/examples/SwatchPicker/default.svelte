<script lang="ts">
    import { SwatchPicker } from '@facile/muse';

    let couleur = $state('#AD9EF0');
</script>

<SwatchPicker label="Couleur d'identité" bind:value={couleur} />

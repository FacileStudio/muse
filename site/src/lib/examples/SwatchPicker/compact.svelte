<script lang="ts">
    import { Inline, SwatchPicker } from '@facile/muse';

    let couleur = $state('#7EEEDB');
</script>

<Inline gap="content">
    <span class="text-fc-sm text-fc-fg">Couleur du projet</span>
    <SwatchPicker size="sm" name="couleur" label="Couleur du projet" bind:value={couleur} />
</Inline>

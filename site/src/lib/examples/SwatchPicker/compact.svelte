<script lang="ts">
    import { Inline, SwatchPicker } from '@facile/muse';

    let couleur = $state('#7EEEDB');
</script>

<Inline>
    <span class="text-fc-p text-fc-ink">Couleur du projet</span>
    <SwatchPicker size="sm" name="couleur" label="Couleur du projet" bind:value={couleur} />
</Inline>

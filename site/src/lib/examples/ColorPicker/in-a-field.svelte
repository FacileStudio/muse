<script lang="ts">
    import { ColorPicker, Field } from '@facile/muse';

    let couleur = $state('#7cc7a4');
</script>

<Field label="Couleur de l'espace" helper="Utilisée dans le sélecteur d'espaces et les étiquettes.">
    <ColorPicker bind:value={couleur} name="space_color" />
</Field>

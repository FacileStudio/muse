<script lang="ts">
    import { Field, Slider } from '@facile/muse';

    let seuil = $state(0.75);
</script>

<Field label="Seuil de confiance">
    <Slider bind:value={seuil} min={0.5} max={1} step={0.05} valueText={(n) => `${Math.round(n * 100)} %`} />
</Field>

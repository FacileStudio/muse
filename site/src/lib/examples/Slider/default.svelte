<script lang="ts">
    import { Field, Slider } from '@facile/muse';

    let volume = $state(70);
</script>

<Field label="Volume">
    <Slider bind:value={volume} valueText={(n) => `${n} %`} />
</Field>
<p class="text-fc-sm text-fc-fg-muted">{volume} %</p>

<script lang="ts">
    import { Slider } from '@facile/muse';

    let fourchette = $state<[number, number]>([20, 80]);
</script>

<Slider range bind:values={fourchette} aria-label="Fourchette de prix" />
<p class="text-fc-sm text-fc-fg-muted">{fourchette[0]} à {fourchette[1]}</p>

<script lang="ts">
    import { ColorPicker } from '@facile/muse';

    let couleur = $state('');

    const palette = ['#ad9ef0', '#7cc7a4', '#f0c46a', '#e08b7c', '#8ab4f0'];
    const noms = {
        '#ad9ef0': 'Lavande',
        '#7cc7a4': 'Menthe',
        '#f0c46a': 'Ambre',
        '#e08b7c': 'Terracotta',
        '#8ab4f0': 'Bleu ciel'
    };
</script>

<ColorPicker bind:value={couleur} swatches={palette} labels={noms} />

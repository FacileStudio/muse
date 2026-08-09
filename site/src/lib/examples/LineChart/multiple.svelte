<script lang="ts">
    import { LineChart } from '@facile/muse';

    const labels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
    const series = [
        { name: 'Studio Facile', data: [42, 48, 51, 47, 56, 61] },
        { name: 'Heranova', data: [12, 18, 24, 31, 29, 34] },
        { name: 'LPB', data: [8, 7, 11, 9, 14, 12] }
    ];
</script>

<div class="w-full">
    <LineChart {series} {labels} smooth height={240} yFormat={(n) => `${n} h`} />
</div>

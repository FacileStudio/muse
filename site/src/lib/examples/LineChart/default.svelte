<script lang="ts">
    import { LineChart } from '@facile/muse';

    const labels = ['S26', 'S27', 'S28', 'S29', 'S30', 'S31', 'S32', 'S33'];
    const series = [
        { name: 'Facturable', data: [31, 34, 28, 36, 33, 21, 38, 35] },
        { name: 'Interne', data: [8, 6, 11, 5, 7, 14, 4, 6] }
    ];
</script>

<div class="w-full">
    <LineChart {series} {labels} yFormat={(n) => `${n} h`} />
</div>

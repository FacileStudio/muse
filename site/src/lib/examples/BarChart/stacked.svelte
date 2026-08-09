<script lang="ts">
    import { BarChart } from '@facile/muse';

    const labels = ['S28', 'S29', 'S30', 'S31', 'S32', 'S33'];
    const series = [
        { name: 'Développement', data: [22, 26, 19, 28, 24, 30] },
        { name: 'Design', data: [12, 9, 14, 7, 11, 8] },
        { name: 'Réunions', data: [5, 6, 4, 6, 7, 5] }
    ];
</script>

<div class="w-full">
    <BarChart {series} {labels} stacked yFormat={(n) => `${n} h`} />
</div>

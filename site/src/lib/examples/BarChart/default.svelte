<script lang="ts">
    import { BarChart } from '@facile/muse';

    const labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'];
    const series = [
        { name: 'Facturable', data: [6.5, 7, 5.5, 7.5, 4] },
        { name: 'Interne', data: [1.5, 1, 2.5, 0.5, 3] }
    ];
</script>

<div class="w-full">
    <BarChart {series} {labels} yFormat={(n) => `${n} h`} />
</div>

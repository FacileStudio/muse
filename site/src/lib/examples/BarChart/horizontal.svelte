<script lang="ts">
    import { BarChart } from '@facile/muse';

    const labels = ['Refonte Sablier', 'Boutique Heranova', 'Vitrine LPB', 'Migration Nuage'];
    const series = [{ name: 'Heures pointées', data: [128, 76.5, 41, 18.25] }];
</script>

<div class="w-full">
    <BarChart {series} {labels} horizontal showLegend={false} height={220} yFormat={(n) => `${n} h`} />
</div>

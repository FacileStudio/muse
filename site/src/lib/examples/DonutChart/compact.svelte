<script lang="ts">
    import { DonutChart } from '@facile/muse';

    const data = [
        { label: 'Utilisé', value: 830 },
        { label: 'Disponible', value: 194 }
    ];
</script>

<DonutChart
    {data}
    size={140}
    thickness={12}
    showLegend={false}
    centerLabel="Quota"
    centerValue="81 %"
/>

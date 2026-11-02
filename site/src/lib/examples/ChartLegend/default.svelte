<script lang="ts">
    import { ChartLegend, chartColor } from '@facile/muse';

    const items = [
        { name: 'Facturable', color: chartColor(0, 3) },
        { name: 'Interne', color: chartColor(1, 3) },
        { name: 'Absences', color: chartColor(2, 3) }
    ];
</script>

<ChartLegend {items} />

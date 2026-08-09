<script lang="ts">
    import { ChartLegend, chartColor } from '@facile/muse';

    const items = [
        { name: 'Facturable', color: chartColor(0) },
        { name: 'Interne', color: chartColor(1) },
        { name: 'Absences', color: chartColor(2) }
    ];
</script>

<ChartLegend {items} />

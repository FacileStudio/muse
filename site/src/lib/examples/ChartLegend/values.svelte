<script lang="ts">
    import { ChartLegend, chartColor } from '@facile/muse';

    const spaces = [
        { name: 'Design', gb: 412 },
        { name: 'Photos', gb: 268 },
        { name: 'Contrats', gb: 96 },
        { name: 'Archives', gb: 54 }
    ];

    const total = spaces.reduce((sum, s) => sum + s.gb, 0);
    const items = spaces.map((s, i) => ({
        name: s.name,
        color: chartColor(i),
        value: `${s.gb} Go · ${Math.round((s.gb / total) * 100)} %`
    }));
</script>

<ChartLegend {items} />

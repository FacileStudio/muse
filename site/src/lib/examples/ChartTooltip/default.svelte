<script lang="ts">
    import { ChartTooltip, chartColor } from '@facile/muse';

    const rows = [
        { name: 'Facturable', value: '7 h 30', color: chartColor(0) },
        { name: 'Interne', value: '1 h 00', color: chartColor(1) }
    ];
</script>

<div class="relative h-32 w-full rounded-fc-md bg-fc-component">
    <ChartTooltip x={40} y={60} title="Jeudi 13 août" {rows} visible />
</div>

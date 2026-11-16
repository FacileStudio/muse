<script lang="ts">
    import { LineChart, type ChartMarker } from '@facile/muse';

    const labels = ['3 nov', '4 nov', '5 nov', '6 nov', '7 nov', '8 nov', '9 nov', '10 nov'];
    const series = [{ name: 'Visiteurs', data: [412, 398, 431, 1290, 446, 120, 405, 420] }];
    const markers: ChartMarker[] = [
        { index: 3, label: 'Pic de visiteurs : ×3' },
        { index: 5, label: 'Chute de visiteurs : −72 %', tone: 'danger' }
    ];

    let picked = $state('');
</script>

<div class="flex w-full flex-col gap-3">
    <LineChart {series} {labels} {markers} area showLegend={false} onMarkerClick={(m) => (picked = m.label)} />
    <p class="text-fc-sm text-fc-fg-muted">{picked || 'Cliquez sur un point.'}</p>
</div>

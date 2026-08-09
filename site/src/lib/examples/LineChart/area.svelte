<script lang="ts">
    import { LineChart } from '@facile/muse';

    const labels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août'];
    const series = [{ name: 'Stockage utilisé', data: [318, 352, 389, 401, 448, 512, 596, 830] }];
</script>

<div class="w-full">
    <LineChart {series} {labels} area smooth showLegend={false} yFormat={(n) => `${n} Go`} />
</div>

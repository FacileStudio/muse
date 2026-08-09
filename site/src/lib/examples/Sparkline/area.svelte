<script lang="ts">
    import { Sparkline, StatCard } from '@facile/muse';

    const data = [318, 352, 389, 401, 448, 512, 596, 830];
</script>

<div class="w-64">
    <StatCard label="Stockage utilisé" value="830 Go" delta="+39 % ce mois">
        <Sparkline {data} area smooth showLast={false} height={36} valueFormat={(n) => `${n} Go`} />
    </StatCard>
</div>

<script lang="ts">
    import { DonutChart } from '@facile/muse';

    const data = [
        { label: 'Facturable', value: 128 },
        { label: 'Interne', value: 42 },
        { label: 'Avant-vente', value: 19 }
    ];
</script>

<div class="w-full">
    <DonutChart
        {data}
        centerLabel="Ce trimestre"
        centerValue="189 h"
        valueFormat={(n) => `${n} h`}
    />
</div>

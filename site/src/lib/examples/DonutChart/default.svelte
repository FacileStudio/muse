<script lang="ts">
    import { DonutChart } from '@facile/muse';

    const data = [
        { label: 'Design', value: 412 },
        { label: 'Photos', value: 268 },
        { label: 'Contrats', value: 96 },
        { label: 'Archives', value: 54 }
    ];
</script>

<div class="w-full">
    <DonutChart {data} valueFormat={(n) => `${n} Go`} />
</div>

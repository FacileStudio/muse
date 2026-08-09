<script lang="ts">
    import { Sparkline, chartColor } from '@facile/muse';

    const rows = [
        { name: 'Refonte Sablier', data: [4, 6, 5, 7, 6.5, 8, 7] },
        { name: 'Boutique Heranova', data: [2, 3, 5, 4, 6, 5.5, 7] },
        { name: 'Vitrine LPB', data: [7, 5, 4, 3, 2.5, 2, 1] }
    ];
</script>

<div class="flex w-full max-w-sm flex-col gap-2">
    {#each rows as row, i (row.name)}
        <div class="flex items-center gap-3">
            <span class="w-40 shrink-0 text-fc-xs text-fc-fg-muted">{row.name}</span>
            <Sparkline data={row.data} color={chartColor(i)} height={28} valueFormat={(n) => `${n} h`} />
        </div>
    {/each}
</div>

<script lang="ts">
    import { ChartTooltip, chartColor } from '@facile/muse';

    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'];
    const hours = [6.5, 7, 5.5, 7.5, 4];

    let x = $state(0);
    let y = $state(0);
    let index = $state(-1);

    function track(event: PointerEvent) {
        const box = (event.currentTarget as HTMLElement).getBoundingClientRect();
        x = event.clientX - box.left;
        y = event.clientY - box.top;
        index = Math.min(days.length - 1, Math.floor((x / box.width) * days.length));
    }
</script>

<div
    role="presentation"
    class="relative flex h-32 w-full items-center justify-center rounded-fc-md bg-fc-component text-fc-xs text-fc-fg-muted"
    onpointermove={track}
    onpointerleave={() => (index = -1)}
>
    Survolez la zone
    <ChartTooltip
        {x}
        {y}
        visible={index >= 0}
        title={days[index]}
        rows={[{ name: 'Facturable', value: `${hours[index]} h`, color: chartColor(0) }]}
    />
</div>

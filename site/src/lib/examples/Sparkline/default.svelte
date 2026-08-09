<script lang="ts">
    import { Sparkline } from '@facile/muse';

    const data = [5.5, 7, 6.5, 8, 7.5, 3, 0, 6, 7, 7.5, 8.5, 6, 2, 0];
</script>

<div class="w-40">
    <Sparkline {data} valueFormat={(n) => `${n} h`} />
</div>

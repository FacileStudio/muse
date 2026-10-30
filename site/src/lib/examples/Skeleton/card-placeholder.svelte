<script lang="ts">
    import { Card, Skeleton } from '@facile/muse';
</script>

<div class="flex flex-col gap-1">
    {#each [0, 1, 2] as ligne (ligne)}
        <Card class="flex items-center gap-1">
            <Skeleton class="size-10 rounded-fc" />
            <div class="flex flex-1 flex-col gap-1">
                <Skeleton class="h-4 w-40" />
                <Skeleton class="h-3 w-24" />
            </div>
            <Skeleton class="h-6 w-16 rounded-fc" />
        </Card>
    {/each}
</div>

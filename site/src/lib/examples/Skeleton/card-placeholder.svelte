<script lang="ts">
    import { Card, Skeleton } from '@facile/muse';
</script>

<div class="flex flex-col gap-3">
    {#each [0, 1, 2] as ligne (ligne)}
        <Card class="flex items-center gap-4">
            <Skeleton class="size-10 rounded-fc-pill" />
            <div class="flex flex-1 flex-col gap-2">
                <Skeleton class="h-4 w-40" />
                <Skeleton class="h-3 w-24" />
            </div>
            <Skeleton class="h-6 w-16 rounded-fc-pill" />
        </Card>
    {/each}
</div>

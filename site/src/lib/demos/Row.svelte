<script lang="ts">
    import type { Snippet } from 'svelte';
    import { Card, Inline, Stack } from '@facile/muse';

    /*
     * One component, rendered. The name, a line on when to reach for it, and the thing itself
     * on a real surface — because "what does it look like" is the question a component page
     * exists to answer, and prop tables do not answer it.
     */
    let {
        name,
        lead,
        children
    }: { name: string; lead?: string; children: Snippet } = $props();
</script>

<Card class="flex flex-col gap-1">
    <Stack>
        <code class="font-fc-mono text-fc-p font-semibold text-fc-ink">{name}</code>
        {#if lead}<p class="text-fc-p text-fc-muted">{lead}</p>{/if}
    </Stack>
    <div class="rounded-fc bg-fc-bg p-4">
        <Inline align="center">
            {@render children()}
        </Inline>
    </div>
</Card>

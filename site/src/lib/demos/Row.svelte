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

<Card class="flex flex-col gap-4">
    <Stack gap="bound">
        <code class="font-fc-mono text-fc-sm font-semibold text-fc-fg">{name}</code>
        {#if lead}<p class="text-fc-sm text-fc-fg-muted">{lead}</p>{/if}
    </Stack>
    <div class="rounded-fc-sm bg-fc-page p-4">
        <Inline gap="content" align="center">
            {@render children()}
        </Inline>
    </div>
</Card>

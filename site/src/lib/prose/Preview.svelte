<script lang="ts">
    import type { Snippet } from 'svelte';
    import { Badge } from '@facile/muse';

    /*
     * A rendered example, optionally marked as the wrong way round.
     *
     * The bad panels render the real defect rather than describing it, which is the whole
     * reason they are here: a paired screenshot rots the first time a token moves, and an agent
     * cannot read a PNG. Markup stays true or breaks the build.
     */
    let {
        verdict,
        label,
        children
    }: { verdict?: 'good' | 'bad'; label?: string; children: Snippet } = $props();
</script>

<div class="flex flex-col gap-3">
    {#if verdict || label}
        <div class="flex flex-wrap items-center gap-2">
            {#if verdict}
                <Badge tone={verdict === 'good' ? 'success' : 'danger'}>
                    {verdict === 'good' ? 'Bon' : 'Mauvais'}
                </Badge>
            {/if}
            {#if label}<span class="text-fc-sm text-fc-fg-muted">{label}</span>{/if}
        </div>
    {/if}
    <div class="rounded-fc-md border border-fc-border bg-fc-page p-5">
        {@render children()}
    </div>
</div>

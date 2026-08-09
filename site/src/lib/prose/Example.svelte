<script lang="ts">
    import type { Component } from 'svelte';
    import { Button, Card, Inline, Stack, icons } from '@facile/muse';

    let {
        title,
        lead,
        component: Rendered,
        source
    }: { title?: string; lead?: string; component: Component; source: string } = $props();

    let showSource = $state(false);
    let copied = $state(false);

    async function copy() {
        await navigator.clipboard.writeText(source);
        copied = true;
        setTimeout(() => (copied = false), 2000);
    }
</script>

<Card class="flex flex-col gap-4">
    {#if title || lead}
        <Stack gap="bound">
            {#if title}<p class="text-fc-md font-semibold text-fc-fg">{title}</p>{/if}
            {#if lead}<p class="text-fc-sm text-fc-fg-muted">{lead}</p>{/if}
        </Stack>
    {/if}

    <div class="rounded-fc-sm bg-fc-page p-5">
        <Rendered />
    </div>

    <Inline gap="tight">
        <Button
            size="sm"
            variant="ghost"
            icon={showSource ? icons.eyeClosed : icons.code}
            onclick={() => (showSource = !showSource)}
        >
            {showSource ? 'Masquer la source' : 'Voir la source'}
        </Button>
        {#if showSource}
            <Button size="sm" variant="ghost" icon={copied ? icons.check : icons.copy} onclick={copy}>
                {copied ? 'Copié' : 'Copier'}
            </Button>
        {/if}
    </Inline>

    {#if showSource}
        <!-- Not highlighted: shiki runs at build time through mdsvex, and these sources are
             read at runtime from the glob. Plain monospace is honest; a half-highlighted block
             would be worse than none. -->
        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
        <!-- The tabindex is deliberate and the rule is a false positive here: WCAG 2.1.1 wants
             a scrollable region to be reachable by keyboard, and `role="region"` plus a label
             is the documented pattern for one. Svelte's check only accepts interactive roles. -->
        <pre
            role="region"
            aria-label="Source de l'exemple"
            tabindex="0"
            class="overflow-x-auto rounded-fc-sm bg-fc-surface p-4"><code
                class="font-fc-mono text-fc-xs leading-relaxed text-fc-fg">{source}</code></pre>
    {/if}
</Card>

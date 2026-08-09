<script lang="ts">
    import type { Snippet } from 'svelte';

    /*
     * mdsvex hands every markdown page through here. The prose styles live in one place rather
     * than on each element, and `.fc-prose` is scoped tight enough that a live component
     * example dropped into a page is not restyled by it.
     */
    let { children }: { children: Snippet } = $props();
</script>

<article class="fc-prose flex flex-col gap-6">
    {@render children()}
</article>

<style>
    .fc-prose :global(h1) {
        font-size: var(--text-fc-2xl);
        line-height: var(--text-fc-2xl--line-height);
        font-weight: 600;
        color: var(--color-fc-fg);
    }

    .fc-prose :global(h2) {
        margin-top: calc(var(--spacing) * 6);
        font-size: var(--text-fc-lg);
        line-height: var(--text-fc-lg--line-height);
        font-weight: 600;
        color: var(--color-fc-fg);
    }

    .fc-prose :global(h3) {
        font-size: var(--text-fc-md);
        font-weight: 600;
        color: var(--color-fc-fg);
    }

    .fc-prose :global(p),
    .fc-prose :global(li) {
        font-size: var(--text-fc-sm);
        line-height: 1.65;
        color: var(--color-fc-fg-muted);
    }

    .fc-prose :global(strong) {
        color: var(--color-fc-fg);
        font-weight: 600;
    }

    .fc-prose :global(a) {
        color: var(--color-fc-fg);
        text-decoration: underline;
        text-underline-offset: 3px;
    }

    .fc-prose :global(ul) {
        display: flex;
        flex-direction: column;
        gap: calc(var(--spacing) * 2);
        padding-left: calc(var(--spacing) * 5);
        list-style: disc;
    }

    .fc-prose :global(code) {
        font-family: var(--font-fc-mono);
        font-size: var(--text-fc-xs);
        color: var(--color-fc-fg);
        background: var(--color-fc-surface);
        border-radius: var(--radius-fc-sm);
        padding: 0.1em 0.35em;
    }

    /* Shiki emits both themes and switches with a CSS variable, so the block follows the
       page rather than the OS — muse lets an app force light on a dark system. */
    .fc-prose :global(.fc-code) {
        overflow-x: auto;
        border-radius: var(--radius-fc-md);
        background: var(--color-fc-surface);
        padding: calc(var(--spacing) * 4);
    }

    .fc-prose :global(.fc-code code) {
        background: none;
        padding: 0;
        font-size: var(--text-fc-xs);
        line-height: 1.7;
    }

    .fc-prose :global(.shiki),
    .fc-prose :global(.shiki span) {
        color: var(--shiki-light);
    }

    :global(:root.dark) .fc-prose :global(.shiki),
    :global(:root.dark) .fc-prose :global(.shiki span) {
        color: var(--shiki-dark);
    }

    @media (prefers-color-scheme: dark) {
        :global(:root:not(.light)) .fc-prose :global(.shiki),
        :global(:root:not(.light)) .fc-prose :global(.shiki span) {
            color: var(--shiki-dark);
        }
    }

    /* `display: block` is what lets a table scroll instead of pushing the page sideways.
       A markdown table with a long code cell has no wrap point, so at 360px it would otherwise
       widen the document and give every page a horizontal scrollbar. */
    .fc-prose :global(table) {
        display: block;
        width: 100%;
        max-width: 100%;
        overflow-x: auto;
        border-collapse: collapse;
        font-size: var(--text-fc-sm);
    }

    .fc-prose :global(th),
    .fc-prose :global(td) {
        min-width: max-content;
    }

    .fc-prose :global(th) {
        text-align: left;
        font-weight: 600;
        color: var(--color-fc-fg);
        padding: calc(var(--spacing) * 2) calc(var(--spacing) * 3);
        border-bottom: 1px solid var(--color-fc-border);
    }

    .fc-prose :global(td) {
        color: var(--color-fc-fg-muted);
        padding: calc(var(--spacing) * 2) calc(var(--spacing) * 3);
        border-bottom: 1px solid var(--color-fc-border);
        vertical-align: top;
    }

    .fc-prose :global(blockquote) {
        border-left: 2px solid var(--color-fc-border);
        padding-left: calc(var(--spacing) * 4);
        color: var(--color-fc-fg-muted);
    }
</style>

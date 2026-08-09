<script lang="ts">
    import { Badge, Inline } from '@facile/muse';

    /*
     * The Bon/Mauvais label above a demo panel. A component and not a snippet: a snippet
     * declared as a direct child of `<Page>` is read as one of Page's props, and one declared at
     * the top level of the module changes the component's own signature enough to fall out of
     * the router's `Record<string, typeof Page>` map.
     */
    let { ok = false, label }: { ok?: boolean; label: string } = $props();
</script>

<Inline gap="tight">
    <Badge tone={ok ? 'success' : 'danger'}>{ok ? 'Bon' : 'Mauvais'}</Badge>
    <span class="text-fc-sm text-fc-fg-muted">{label}</span>
</Inline>

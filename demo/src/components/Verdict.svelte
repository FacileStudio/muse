<script lang="ts">
    import { Badge, Inline } from '@facile/muse';

    let { ok = false, label }: { ok?: boolean; label: string } = $props();
</script>

<Inline gap="tight">
    <Badge tone={ok ? 'success' : 'danger'}>{ok ? 'Bon' : 'Mauvais'}</Badge>
    <span class="text-fc-sm text-fc-fg-muted">{label}</span>
</Inline>

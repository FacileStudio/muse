<script lang="ts">
    import { StatusDot } from '@facile/muse';
</script>

<div class="flex flex-col gap-2">
    <StatusDot tone="success" label="PostgreSQL — 12 ms" />
    <StatusDot tone="warning" label="Antenne — latence élevée" />
    <StatusDot tone="danger" label="Redis — injoignable" />
    <StatusDot tone="neutral" label="Worker d'export — au repos" />
</div>

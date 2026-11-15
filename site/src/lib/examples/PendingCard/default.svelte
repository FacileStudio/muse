<script lang="ts">
    import { PendingCard, icons } from '@facile/muse';

    let busy = $state(false);
</script>

<PendingCard
    kind="Supprimer le brouillon"
    client="bulle"
    createdAt={new Date(Date.now() - 600000)}
    {busy}
    confirmLabel="Supprimer"
    confirmIcon={icons.remove}
    onConfirm={() => (busy = true)}
    onDismiss={() => {}}
>
    <div class="flex flex-col gap-1 rounded-fc-md bg-fc-surface p-4">
        <p class="text-fc-md font-medium">Proposition Acme</p>
        <p class="text-fc-sm text-fc-fg-muted">Brouillon enregistré hier à 17:42</p>
    </div>
</PendingCard>

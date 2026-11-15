<script lang="ts">
    import { PendingCard } from '@facile/muse';
</script>

<PendingCard
    kind="Envoyer l'e-mail"
    tone="accent"
    client="https://claude.ai/client"
    createdAt={new Date()}
    state="changed"
    confirmLabel="Envoyer"
    confirmVariant="primary"
    onConfirm={() => {}}
    onDismiss={() => {}}
/>

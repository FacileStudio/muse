<script lang="ts">
    import { Field, Textarea } from '@facile/muse';

    const MAX = 280;
    let resume = $state('');
    const restant = $derived(MAX - resume.length);
</script>

<Field label="Résumé de l'espace" error={restant < 0 ? 'Résumé trop long.' : undefined}>
    <Textarea bind:value={resume} rows={3} maxlength={MAX} placeholder="Ce que fait cet espace…" />
</Field>
<p class="mt-1 text-fc-xs text-fc-fg-muted">{restant} caractères restants</p>

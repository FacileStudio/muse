<script lang="ts">
    import { Button, Drawer, Field, Input, Stack, Textarea, toast } from '@facile/muse';

    let open = $state(false);
    let title = $state('Migrer la base vers PostgreSQL 16');
</script>

<Button variant="outline" onclick={() => (open = true)}>Nouvelle tâche</Button>

<Drawer bind:open title="Nouvelle tâche" showClose>
    <Stack gap="tight">
        <Field label="Titre"><Input bind:value={title} /></Field>
        <Field label="Notes"><Textarea rows={3} placeholder="Contexte, liens, critères d'acceptation" /></Field>
    </Stack>

    {#snippet footer()}
        <div class="flex gap-2">
            <Button variant="ghost" class="flex-1" onclick={() => (open = false)}>Annuler</Button>
            <Button class="flex-1" onclick={() => { open = false; toast.success('Tâche créée dans l\'espace Infra.'); }}>
                Créer
            </Button>
        </div>
    {/snippet}
</Drawer>

<script lang="ts">
    import { Button, Field, Input, Modal, toast } from '@facile/muse';

    let open = $state(false);
    let name = $state('Refonte Sablier');
</script>

<Button variant="outline" onclick={() => (open = true)}>Renommer le projet</Button>

<Modal bind:open title="Renommer le projet" size="sm">
    <Field label="Nom du projet"><Input bind:value={name} /></Field>

    {#snippet footer()}
        <Button variant="ghost" onclick={() => (open = false)}>Annuler</Button>
        <Button onclick={() => { open = false; toast.success(`Projet renommé en « ${name} ».`); }}>
            Enregistrer
        </Button>
    {/snippet}
</Modal>

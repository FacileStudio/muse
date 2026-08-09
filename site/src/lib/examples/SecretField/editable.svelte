<script lang="ts">
    import { Button, SecretField } from '@facile/muse';

    let secret = $state('');
</script>

<SecretField
    editable
    bind:value={secret}
    label="Secret partagé Nook Pool"
    placeholder="Collez le secret de l'instance"
    helper="Il doit correspondre à celui configuré sur pool.facile.studio."
>
    {#snippet actions()}
        <Button size="lg" disabled={secret.length === 0}>Enregistrer</Button>
    {/snippet}
</SecretField>

<script lang="ts">
    import { Field, Input } from '@facile/muse';

    let email = $state('camille@');

    const erreur = $derived(email.includes('@') && email.split('@')[1] ? undefined : 'Adresse e-mail incomplète.');
</script>

<Field label="Inviter par e-mail" error={erreur} helper="L'invitation expire au bout de sept jours.">
    <Input bind:value={email} type="email" placeholder="camille@heranova.fr" />
</Field>

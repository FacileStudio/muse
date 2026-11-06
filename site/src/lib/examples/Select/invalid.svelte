<script lang="ts">
    import { Field, Select } from '@facile/muse';

    let role = $state('');
</script>

<Field label="Rôle" error={role === '' ? 'Choisissez un rôle.' : undefined}>
    <Select
        bind:value={role}
        options={[{ value: '', label: 'Aucun' }, { value: 'admin', label: 'Admin' }, { value: 'membre', label: 'Membre' }]}
    />
</Field>

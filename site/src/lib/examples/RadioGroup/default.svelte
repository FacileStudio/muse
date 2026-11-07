<script lang="ts">
    import { Field, RadioGroup } from '@facile/muse';

    let formule = $state('pro');
</script>

<Field label="Formule" helper="Modifiable à tout moment.">
    <RadioGroup
        bind:value={formule}
        options={[
            { value: 'free', label: 'Découverte' },
            { value: 'pro', label: 'Pro' },
            { value: 'team', label: 'Équipe' },
            { value: 'old', label: 'Ancienne formule', disabled: true }
        ]}
    />
</Field>

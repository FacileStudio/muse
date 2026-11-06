<script lang="ts">
    import { Select } from '@facile/muse';

    let langue = $state('fr');
</script>

<Select
    bind:value={langue}
    aria-label="Langue"
    placeholder="Choisir une langue"
    options={[
        { value: 'fr', label: 'Français' },
        { value: 'en', label: 'English' },
        { value: 'de', label: 'Deutsch', disabled: true },
        { value: 'es', label: 'Español' }
    ]}
/>

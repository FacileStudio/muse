<script lang="ts">
    import { ToggleGroup } from '@facile/muse';

    let locale = $state('fr');
</script>

<ToggleGroup
    label="Langue"
    bind:value={locale}
    items={[
        { value: 'fr', label: 'FR' },
        { value: 'en', label: 'EN' }
    ]}
/>

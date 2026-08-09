<script lang="ts">
    import { SpaceSwitcher } from '@facile/muse';

    let espace = $state<string | null>(null);
</script>

<SpaceSwitcher
    class="w-64"
    activeId={espace}
    onSelect={(id) => (espace = id)}
    personalLabel="Mon espace"
    manageHref="#espaces"
    manageLabel="Gérer les espaces"
    spaces={[
        { id: 'heranova', name: 'Heranova' },
        { id: 'lpb', name: 'La Petite Boulangerie' }
    ]}
/>

<script lang="ts">
    import { SpaceSwitcher } from '@facile/muse';

    let espace = $state<string | null>(null);
</script>

<SpaceSwitcher
    class="w-64"
    personalLabel="Espace personnel"
    activeId={espace}
    onSelect={(id) => (espace = id)}
    spaces={[{ id: 'heranova', name: 'Heranova' }]}
/>

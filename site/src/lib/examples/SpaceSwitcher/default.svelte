<script lang="ts">
    import { SpaceSwitcher } from '@facile/muse';

    let espace = $state<string | null>('heranova');
</script>

<SpaceSwitcher
    class="w-64"
    activeId={espace}
    onSelect={(id) => (espace = id)}
    spaces={[
        { id: 'heranova', name: 'Heranova' },
        { id: 'gf-conseil', name: 'GF Conseil' },
        { id: 'laura-herve', name: 'Laura Hervé' }
    ]}
/>

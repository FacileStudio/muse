<script lang="ts">
    import { ToggleGroup, icons } from '@facile/muse';

    let view = $state('grid');
</script>

<ToggleGroup
    label="Affichage"
    bind:value={view}
    items={[
        { value: 'grid', icon: icons.widget, label: 'Grille' },
        { value: 'list', icon: icons.layers, label: 'Liste' }
    ]}
/>

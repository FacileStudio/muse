<script lang="ts">
    import { icons, OptionCards } from '@facile/muse';

    let vue = $state('liste');
</script>

<OptionCards
    label="Affichage des projets"
    bind:value={vue}
    options={[
        { value: 'liste', label: 'Liste', icon: icons.text },
        { value: 'tableau', label: 'Tableau', icon: icons.layers },
        { value: 'gantt', label: 'Gantt', icon: icons.calendar, disabled: true }
    ]}
/>

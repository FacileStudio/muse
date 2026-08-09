<script lang="ts">
    import { icons, OptionCards } from '@facile/muse';

    let theme = $state('systeme');
</script>

<OptionCards
    label="Thème de l'interface"
    bind:value={theme}
    options={[
        { value: 'systeme', label: 'Système', icon: icons.monitor },
        { value: 'clair', label: 'Clair', icon: icons.sun },
        { value: 'sombre', label: 'Sombre', icon: icons.moon }
    ]}
/>

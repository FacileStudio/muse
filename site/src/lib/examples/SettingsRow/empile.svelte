<script lang="ts">
    import { Button, Inline, Input, SettingsRow } from '@facile/muse';

    let domaine = $state('heranova.fr');
</script>

<SettingsRow
    stacked
    label="Domaine de l'espace"
    description="Toute adresse de ce domaine rejoint l'espace sans invitation."
>
    <Inline gap="tight" class="w-full">
        <Input bind:value={domaine} class="min-w-0 flex-1" />
        <Button size="lg">Vérifier</Button>
    </Inline>
</SettingsRow>

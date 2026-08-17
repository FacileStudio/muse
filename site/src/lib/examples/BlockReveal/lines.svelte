<!--
    Un panneau couvre un élément. Une accroche de plusieurs lignes se découpe donc ligne par
    ligne, chacune avec son propre panneau décalé par `delay` — sans quoi elle arrive d'un
    seul bloc. `open` mène les trois depuis le parent, pour qu'elles partent ensemble.
-->
<script lang="ts">
    import { BlockReveal, Stack, Switch } from '@facile/muse';

    let shown = $state(true);

    const lines = ['Nous construisons', 'des expériences', 'mémorables.'];
</script>

<Stack gap="content">
    <Stack gap="bound">
        {#each lines as line, i (line)}
            <BlockReveal open={shown} delay={i * 0.12} class="text-fc-2xl font-semibold text-fc-fg">
                {line}
            </BlockReveal>
        {/each}
    </Stack>
    <Switch bind:checked={shown} label="Afficher" class="text-fc-sm" />
</Stack>

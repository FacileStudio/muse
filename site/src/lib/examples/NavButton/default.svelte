<script lang="ts">
    import { icons, NavButton, Stack } from '@facile/muse';
</script>

<Stack gap="none" class="w-64">
    <NavButton href="#tableau-de-bord" icon={icons.dashboard} label="Tableau de bord" active />
    <NavButton href="#projets" icon={icons.folder} label="Projets" />
    <NavButton href="#feuilles" icon={icons.clock} label="Feuilles de temps" />
    <NavButton href="#equipe" icon={icons.usersGroup} label="Équipe" />
</Stack>

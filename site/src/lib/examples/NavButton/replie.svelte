<script lang="ts">
    import { icons, NavButton, Stack } from '@facile/muse';
</script>

<Stack gap="none" class="w-fit">
    <NavButton href="#tableau-de-bord" icon={icons.dashboard} label="Tableau de bord" collapsed active />
    <NavButton href="#projets" icon={icons.folder} label="Projets" collapsed />
    <NavButton href="#equipe" icon={icons.usersGroup} label="Équipe" collapsed />
</Stack>

<script lang="ts">
    import { icons, NavButton, Stack } from '@facile/muse';
</script>

<Stack gap="none" class="w-64">
    <NavButton href="#" icon={icons.dashboard} label="Tableau de bord" active />
    <NavButton href="#" icon={icons.folder} label="Projets" />
    <NavButton href="#" icon={icons.clock} label="Feuilles de temps" />
    <NavButton href="#" icon={icons.usersGroup} label="Équipe" />
</Stack>

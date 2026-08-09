<script lang="ts">
    import { icons, NavButton, Stack } from '@facile/muse';
</script>

<Stack gap="none" class="w-fit">
    <NavButton href="#" icon={icons.dashboard} label="Tableau de bord" collapsed active />
    <NavButton href="#" icon={icons.folder} label="Projets" collapsed />
    <NavButton href="#" icon={icons.usersGroup} label="Équipe" collapsed />
</Stack>

<!--
    Les marques des apps sont des icônes Solar `bold-duotone` que muse ne livre pas : une app les
    enregistre avec `registerIcons`. Cet exemple prend des icônes de la map `icons` pour rester
    autonome.
-->
<script lang="ts">
    import { WorksWith, icons } from '@facile/muse';

    const apps = [
        { name: 'Courrier', icon: icons.mail, line: 'Joignez un fichier Nuage à un mail.', href: 'https://courrier.facile.studio' },
        { name: 'Agenda', icon: icons.calendar, line: 'Retrouvez les pièces jointes de vos rendez-vous.', href: 'https://agenda.facile.studio' },
        { name: 'Bulle', icon: icons.ideas, line: "L'assistant retrouve un fichier pour vous." }
    ];
</script>

<WorksWith {apps} />

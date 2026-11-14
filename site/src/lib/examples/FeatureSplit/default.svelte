<script lang="ts">
    import { FeatureSplit, icons } from '@facile/muse';

    const features = [
        { icon: icons.refresh, title: 'Synchronisation', text: 'Vos dossiers suivent sur chaque appareil.' },
        { icon: icons.external, title: 'Liens de partage', text: 'Un lien, une date de fin, un mot de passe si besoin.' },
        { icon: icons.usersGroup, title: 'Espaces partagés', text: "Toute l'équipe voit les mêmes fichiers." },
        { icon: icons.history, title: 'Versions', text: 'Revenez à la version de la semaine dernière.' }
    ];
</script>

<FeatureSplit id="features" title="Tout ce qu'il faut pour vos fichiers" description="Quatre choses, bien faites." {features} />

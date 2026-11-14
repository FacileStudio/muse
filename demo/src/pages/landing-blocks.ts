import { icons, type DeveloperRow, type FeatureItem, type WorksWithApp } from '@facile/muse';

export const features: FeatureItem[] = [
    { icon: icons.refresh, title: 'Synchronisation', text: 'Vos dossiers suivent sur chaque appareil.' },
    { icon: icons.external, title: 'Liens de partage', text: 'Un lien, une date de fin, un mot de passe si besoin.' },
    { icon: icons.usersGroup, title: 'Espaces partagés', text: "Toute l'équipe voit les mêmes fichiers." },
    { icon: icons.history, title: 'Versions', text: 'Revenez à la version de la semaine dernière.' }
];

export const apps: WorksWithApp[] = [
    { name: 'Courrier', icon: 'solar:letter-opened-bold-duotone', line: 'Joignez un fichier Nuage à un mail.', href: 'https://courrier.facile.studio' },
    { name: 'Docs', icon: 'solar:documents-bold-duotone', line: 'Ouvrez un document sans le télécharger.', href: 'https://docs.facile.studio' },
    { name: 'Bulle', icon: 'solar:smile-circle-bold-duotone', line: "L'assistant retrouve un fichier pour vous." }
];

export const rows: DeveloperRow[] = [
    { kind: 'cli', text: 'Synchronisez et partagez depuis le terminal.', command: 'brew install facilestudio/tap/nuage' },
    { kind: 'api', text: 'Une API REST documentée.', href: 'https://nuage.facile.studio/docs/api' },
    { kind: 'mcp', text: 'Donnez vos fichiers à un agent, avec vos droits.', command: 'nuage mcp install' },
    { kind: 'source', text: 'Le code est ouvert, lisez-le ou contribuez.', href: 'https://github.com/FacileStudio/Nuage' }
];

export const notes: Record<string, string> = {
    free: 'Liens de partage',
    pro: 'Liens protégés par mot de passe',
    team: 'Espaces partagés pour toute l’équipe'
};

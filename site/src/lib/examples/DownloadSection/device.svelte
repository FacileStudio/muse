<!--
    Sur la page d'accueil, `mode="device"` ne montre que la plateforme du visiteur : ses fichiers
    (Apple Silicon et Intel, ou .deb et AppImage), plus le terminal sur ordinateur, jamais sur un
    téléphone. Un lien « Autres plateformes » mène à `allHref`. Si rien ne correspond, ou avant
    l'hydratation, seul le bouton « Tous les téléchargements » s'affiche. La page `/downloads`
    garde le mode par défaut, `all`, qui liste tout.
-->
<script lang="ts">
    import { DownloadSection, type CliCommand, type DownloadEntry } from '@facile/muse';

    const base = 'https://github.com/FacileStudio/sonar/releases/download/v0.19.0';

    const downloads: DownloadEntry[] = [
        { platform: 'macos', href: `${base}/sonar-arm64.dmg`, label: 'Apple Silicon', arch: 'arm64', size: 18_400_000 },
        { platform: 'macos', href: `${base}/sonar-x64.dmg`, label: 'Intel', arch: 'x64', size: 19_100_000 },
        { platform: 'windows', href: `${base}/sonar-setup.exe`, label: 'Installer', arch: 'x64', size: 12_700_000 },
        { platform: 'linux', href: `${base}/sonar.deb`, label: '.deb', arch: 'x64', size: 20_200_000 },
        { platform: 'linux', href: `${base}/sonar.AppImage`, label: 'AppImage', arch: 'x64', size: 21_000_000 },
        { platform: 'android', href: `${base}/sonar.apk`, label: 'APK', size: 4_200_000 },
        { platform: 'android', href: 'https://play.google.com/store/apps/details?id=studio.facile.sonar', label: 'Play Store' }
    ];

    const commands: CliCommand[] = [
        { label: 'Go', command: 'go install github.com/FacileStudio/sonar@latest' },
        { label: 'Homebrew', command: 'brew install facilestudio/tap/sonar' }
    ];
</script>

<DownloadSection mode="device" allHref="/downloads" {downloads} {commands} />

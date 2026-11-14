<!--
    La page `/downloads` garde le mode par défaut, `all` : une carte par plateforme, celle du
    visiteur en premier, et toutes les commandes du terminal.
-->
<script lang="ts">
    import { DownloadSection, type CliCommand, type DownloadEntry } from '@facile/muse';

    const base = 'https://github.com/FacileStudio/sablier/releases/download/v1.4.0';

    const downloads: DownloadEntry[] = [
        { platform: 'macos', href: `${base}/sablier-arm64.dmg`, label: 'Apple Silicon', arch: 'arm64', version: 'v1.4.0', size: 18_400_000 },
        { platform: 'macos', href: `${base}/sablier-x64.dmg`, label: 'Intel', arch: 'x64', version: 'v1.4.0', size: 19_100_000 },
        { platform: 'windows', href: `${base}/sablier-setup.exe`, label: 'Installer', arch: 'x64', version: 'v1.4.0', size: 12_700_000 },
        { platform: 'linux', href: `${base}/sablier.AppImage`, label: 'AppImage', arch: 'x64', size: 21_000_000 },
        { platform: 'linux', href: `${base}/sablier.deb`, label: '.deb', arch: 'x64', checksumHref: `${base}/sablier.deb.sha256` },
        { platform: 'ios', href: 'https://apps.apple.com/app/id0000000000', label: 'App Store' },
        { platform: 'android', href: `${base}/sablier.apk`, label: 'APK', version: 'v1.4.0', size: 4_200_000 }
    ];

    const commands: CliCommand[] = [
        { label: 'Script', command: 'curl -fsSL https://sablier.facile.studio/install.sh | sh' },
        { label: 'Homebrew', command: 'brew install facilestudio/tap/sablier' },
        { label: 'Go', command: 'go install github.com/FacileStudio/sablier/cmd/sablier@latest' }
    ];
</script>

<DownloadSection
    {downloads}
    {commands}
    releasesHref="https://github.com/FacileStudio/sablier/releases"
    checksumsHref={`${base}/checksums.txt`}
/>

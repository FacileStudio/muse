<script lang="ts">
    import { ForDevelopers, type DeveloperRow } from '@facile/muse';

    const rows: DeveloperRow[] = [
        { kind: 'cli', text: 'Synchronisez et partagez depuis le terminal.', command: 'brew install facilestudio/tap/nuage' },
        { kind: 'api', text: 'Une API REST documentée.', href: 'https://nuage.facile.studio/docs/api' },
        { kind: 'mcp', text: 'Donnez vos fichiers à un agent, avec vos droits.' },
        { kind: 'source', text: 'Le code est ouvert.', href: 'https://github.com/FacileStudio/Nuage' }
    ];
</script>

<ForDevelopers {rows} selfHostHref="https://suite.facile.studio/auto-hebergement" />

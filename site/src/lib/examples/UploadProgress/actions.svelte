<script lang="ts">
    import { UploadProgress, type UploadProgressProps } from '@facile/muse';

    let fichiers = $state<UploadProgressProps['items']>([
        { id: '1', name: 'rapport-trimestriel.pdf', size: 984320, progress: 100, status: 'done' },
        {
            id: '2',
            name: 'archive-projets.zip',
            size: 48211724,
            progress: 41,
            status: 'error',
            error: 'Connexion interrompue à 41 %.'
        }
    ]);

    const relancer = (id: string) => {
        fichiers = fichiers.map((f) =>
            f.id === id ? { ...f, status: 'uploading' as const, error: undefined } : f
        );
    };
</script>

<UploadProgress
    items={fichiers}
    onRetry={relancer}
    onCancel={(id) => (fichiers = fichiers.filter((f) => f.id !== id))}
/>

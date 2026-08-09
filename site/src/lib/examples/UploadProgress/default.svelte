<script lang="ts">
    import { UploadProgress, type UploadProgressProps } from '@facile/muse';

    const fichiers: UploadProgressProps['items'] = [
        { id: '1', name: 'facture-heranova-042.pdf', size: 184320, progress: 100, status: 'done' },
        { id: '2', name: 'maquette-accueil.png', size: 2411724, progress: 62, status: 'uploading' },
        { id: '3', name: 'contrat-signe.pdf', size: 512000, progress: 0, status: 'pending' }
    ];
</script>

<UploadProgress items={fichiers} />

<script lang="ts">
    import { UploadProgress, type UploadProgressProps } from '@facile/muse';

    const fichiers: UploadProgressProps['items'] = [
        { id: '1', name: 'photo-equipe.jpg', size: 3211724, progress: 78, status: 'uploading' }
    ];
</script>

<UploadProgress items={fichiers} showTotal={false} />

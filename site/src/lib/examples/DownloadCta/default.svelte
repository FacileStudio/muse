<script lang="ts">
    import { DownloadCta } from '@facile/muse';
</script>

<div class="flex flex-col gap-3">
    <DownloadCta href="/downloads" />
    <DownloadCta href="/downloads" platforms={['android', 'ios']} />
</div>

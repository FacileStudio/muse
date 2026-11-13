<script lang="ts">
    import { ConnectionHint } from '@facile/muse';
</script>

<div class="flex flex-wrap items-center gap-3">
    <ConnectionHint state="connecting" />
    <ConnectionHint state="offline" />
    <ConnectionHint state="stopped" />
</div>

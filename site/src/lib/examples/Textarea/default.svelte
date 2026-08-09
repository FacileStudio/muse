<script lang="ts">
    import { Textarea } from '@facile/muse';

    let description = $state('');
</script>

<Textarea bind:value={description} placeholder="Décrivez le projet en quelques lignes…" />

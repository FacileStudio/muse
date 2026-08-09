<script lang="ts">
    import { Input } from '@facile/muse';

    let nom = $state('');
</script>

<Input bind:value={nom} placeholder="Nom du projet" />

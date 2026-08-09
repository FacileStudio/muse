<script lang="ts">
    import { Radio } from '@facile/muse';

    let visibilite = $state('espace');
</script>

<div class="flex flex-col gap-2">
    <Radio name="visibilite" value="espace" label="Visible par l'espace" bind:group={visibilite} />
    <Radio name="visibilite" value="prive" label="Privé" bind:group={visibilite} />
    <Radio name="visibilite" value="public" label="Lien public" bind:group={visibilite} />
</div>

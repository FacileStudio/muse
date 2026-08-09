<script lang="ts">
    import { Button, icons } from '@facile/muse';
</script>

<div class="flex flex-wrap items-center gap-3">
    <Button icon={icons.plus}>Nouveau projet</Button>
    <Button variant="outline" icon={icons.download}>Exporter le CSV</Button>
    <Button variant="danger" icon={icons.remove}>Supprimer</Button>
</div>

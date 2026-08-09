<script lang="ts">
    import { Button, icons } from '@facile/muse';
</script>

<div class="flex flex-wrap items-center gap-3">
    <Button href="/projets" iconRight={icons.arrow}>Tous les projets</Button>
    <Button variant="outline" href="/exports/temps.csv" download icon={icons.download}>
        Télécharger le rapport
    </Button>
</div>

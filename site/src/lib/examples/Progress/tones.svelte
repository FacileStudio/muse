<script lang="ts">
    import { Progress, Stack } from '@facile/muse';
</script>

<Stack>
    <Progress value={30} tone="success" label="Sauvegarde" />
    <Progress value={85} tone="warning" label="Quota" />
    <Progress value={100} tone="danger" label="Espace disque" />
    <Progress label="Synchronisation" />
</Stack>

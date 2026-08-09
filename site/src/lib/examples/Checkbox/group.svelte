<script lang="ts">
    import { Checkbox } from '@facile/muse';

    let notifications = $state({ mention: true, assignation: true, hebdo: false });
    const actives = $derived(Object.values(notifications).filter(Boolean).length);
</script>

<div class="flex flex-col gap-2">
    <Checkbox label="Quand on me mentionne" bind:checked={notifications.mention} />
    <Checkbox label="Quand une tâche m'est assignée" bind:checked={notifications.assignation} />
    <Checkbox label="Résumé hebdomadaire" bind:checked={notifications.hebdo} />
    <p class="text-fc-xs text-fc-fg-muted">{actives} notification(s) active(s)</p>
</div>

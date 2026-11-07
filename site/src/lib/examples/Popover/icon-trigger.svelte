<script lang="ts">
    import { Icon, Popover, icons } from '@facile/muse';
</script>

<Popover label="Informations" align="end">
    {#snippet trigger()}
        <Icon icon={icons.info} size={18} />
    {/snippet}
    <p class="text-fc-sm text-fc-fg-muted">Un panneau court : une explication, un réglage, un formulaire de deux champs.</p>
</Popover>

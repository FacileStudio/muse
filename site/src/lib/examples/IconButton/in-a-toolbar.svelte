<script lang="ts">
    import { Icon, IconButton, icons } from '@facile/muse';

    let masque = $state(true);
</script>

<div class="flex items-center gap-2">
    <span class="flex-1 font-mono text-fc-sm text-fc-fg">
        {masque ? '••••••••••••••••' : 'sk_live_9f2c41ab77e0'}
    </span>
    <IconButton
        variant="ghost"
        aria-label={masque ? 'Afficher la clé' : 'Masquer la clé'}
        onclick={() => (masque = !masque)}
    >
        <Icon icon={masque ? icons.eye : icons.eyeClosed} />
    </IconButton>
    <IconButton variant="ghost" aria-label="Copier la clé">
        <Icon icon={icons.copy} />
    </IconButton>
    <IconButton variant="danger" aria-label="Révoquer la clé">
        <Icon icon={icons.revoke} />
    </IconButton>
</div>

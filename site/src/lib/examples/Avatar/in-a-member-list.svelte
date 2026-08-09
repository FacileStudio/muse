<script lang="ts">
    import { Avatar, Badge } from '@facile/muse';
    import type { BadgeProps } from '@facile/muse';

    const membres: { nom: string; email: string; role: string; tone: BadgeProps['tone'] }[] = [
        { nom: 'Yann Ravenel', email: 'yann@facile.studio', role: 'Propriétaire', tone: 'owner' },
        { nom: 'Marion Masson', email: 'marion@facile.studio', role: 'Admin', tone: 'admin' },
        { nom: 'Laura Hervé', email: 'laura@facile.studio', role: 'Membre', tone: 'neutral' }
    ];
</script>

<ul class="flex flex-col gap-3">
    {#each membres as membre (membre.email)}
        <li class="flex items-center gap-3">
            <Avatar name={membre.nom} size="sm" />
            <div class="min-w-0 flex-1">
                <p class="text-fc-sm text-fc-fg">{membre.nom}</p>
                <p class="text-fc-xs text-fc-fg-muted">{membre.email}</p>
            </div>
            <Badge tone={membre.tone}>{membre.role}</Badge>
        </li>
    {/each}
</ul>

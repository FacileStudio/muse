<script lang="ts">
    import { Avatar, Badge, Inline, Table } from '@facile/muse';

    const members = [
        { name: 'Camille Roux', email: 'camille.roux@facile.studio', role: 'owner', hours: '87 h' },
        { name: 'Yanis Berthier', email: 'yanis@heranova.fr', role: 'admin', hours: '64 h 30' },
        { name: 'Léa Fontaine', email: 'lea.fontaine@facile.studio', role: 'member', hours: '52 h' }
    ] as const;
</script>

<Table>
    <thead>
        <tr><th>Membre</th><th>Rôle</th><th>Ce mois</th></tr>
    </thead>
    <tbody>
        {#each members as member (member.email)}
            <tr>
                <td>
                    <Inline gap="tight">
                        <Avatar name={member.name} size="sm" />
                        <span class="font-medium">{member.name}</span>
                    </Inline>
                </td>
                <td><Badge tone={member.role === 'member' ? 'neutral' : member.role}>{member.role}</Badge></td>
                <td class="tabular-nums">{member.hours}</td>
            </tr>
        {/each}
    </tbody>
</Table>

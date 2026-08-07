<script lang="ts">
    import {
        Avatar,
        Badge,
        Button,
        ConfirmModal,
        Input,
        Select,
        SettingsRow,
        SettingsSection,
        Table,
        icons
    } from '@facile/lib';
    import { currentUser, roleLabel, roleTone, wait, type Member, type Role } from '../../data.js';

    type TeamMember = Member & { joined: string };

    let members = $state<TeamMember[]>([
        { id: 'm1', name: currentUser.name, email: currentUser.email, role: 'owner', joined: 'Mar 2024' },
        { id: 'm2', name: 'Sacha', email: 'sacha@facile.studio', role: 'admin', joined: 'Jun 2024' },
        { id: 'm3', name: 'Noor', email: 'noor@facile.studio', role: 'member', joined: 'Jan 2026' }
    ]);

    let invites = $state([{ email: 'jules@acme.com', role: 'member' as Role, sent: '2 days ago' }]);

    let inviteEmail = $state('');
    let inviteRole = $state<Role>('member');

    let removeTarget = $state<TeamMember | null>(null);
    let removeOpen = $state(false);

    function invite(e: Event) {
        e.preventDefault();
        const email = inviteEmail.trim();
        if (!email) return;
        invites = [...invites, { email, role: inviteRole, sent: 'just now' }];
        inviteEmail = '';
    }

    async function remove() {
        await wait(500);
        members = members.filter((m) => m.id !== removeTarget?.id);
        removeTarget = null;
    }
</script>

<div class="flex flex-col gap-10">
    <SettingsSection
        title="Members"
        description="Everyone with access to Acme Studio. Owners cannot be removed."
        bare
    >
        <Table>
            <thead>
                <tr>
                    <th>Person</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th class="text-right">Actions</th>
                </tr>
            </thead>
            <tbody>
                {#each members as member (member.id)}
                    <tr>
                        <td>
                            <div class="flex min-w-0 items-center gap-3">
                                <Avatar name={member.name} size="sm" />
                                <div class="flex min-w-0 flex-col">
                                    <span class="truncate font-medium text-fc-fg">{member.name}</span>
                                    <span class="truncate text-fc-xs text-fc-fg-muted">{member.email}</span>
                                </div>
                            </div>
                        </td>
                        <td><Badge tone={roleTone[member.role]}>{roleLabel[member.role]}</Badge></td>
                        <td class="whitespace-nowrap text-fc-fg-muted">{member.joined}</td>
                        <td class="text-right">
                            {#if member.role !== 'owner'}
                                <Button
                                    variant="ghost-danger"
                                    size="sm"
                                    icon={icons.remove}
                                    onclick={() => {
                                        removeTarget = member;
                                        removeOpen = true;
                                    }}
                                >
                                    Remove
                                </Button>
                            {/if}
                        </td>
                    </tr>
                {/each}
            </tbody>
        </Table>
    </SettingsSection>

    <SettingsSection
        title="Invite"
        description="They get an email with a link. Facile SSO handles the rest."
    >
        <form class="flex flex-col gap-3 sm:flex-row" onsubmit={invite}>
            <Input
                bind:value={inviteEmail}
                type="email"
                placeholder="name@studio.com"
                aria-label="Email to invite"
                class="flex-1"
            />
            <Select bind:value={inviteRole} aria-label="Role" class="sm:w-40">
                <option value="member">Member</option>
                <option value="admin">Admin</option>
            </Select>
            <Button type="submit" icon={icons.plus} class="sm:shrink-0">Send invite</Button>
        </form>
    </SettingsSection>

    {#if invites.length > 0}
        <SettingsSection title="Pending invites" description="Unaccepted after 7 days, they expire.">
            {#each invites as invite (invite.email)}
                <SettingsRow label={invite.email} description="Sent {invite.sent}">
                    <Badge tone={roleTone[invite.role]}>{roleLabel[invite.role]}</Badge>
                    <Button
                        variant="ghost-danger"
                        icon={icons.close}
                        onclick={() => (invites = invites.filter((i) => i.email !== invite.email))}
                    >
                        Cancel
                    </Button>
                </SettingsRow>
            {/each}
        </SettingsSection>
    {/if}
</div>

<ConfirmModal
    bind:open={removeOpen}
    tone="danger"
    title="Remove this member?"
    description={`${removeTarget?.name ?? ''} loses access to Acme Studio immediately. Their entries and files stay — they are just no longer theirs to open.`}
    confirmLabel="Remove"
    cancelLabel="Keep access"
    onConfirm={remove}
/>

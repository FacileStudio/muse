<script lang="ts">
    import {
        Alert,
        Avatar,
        Badge,
        Button,
        Card,
        ColorPicker,
        ConfirmModal,
        Divider,
        Drawer,
        Field,
        Input,
        Modal,
        Select,
        SpaceSwitcher,
        StatCard,
        Textarea,
        USER_COLORS,
        icons
    } from '@facile/lib';

    type Role = 'owner' | 'admin' | 'neutral';

    type Member = { id: string; name: string; email: string; role: Role };

    type Space = {
        id: string;
        name: string;
        description: string;
        color: string;
        projects: number;
        hours: number;
        members: Member[];
    };

    let spaces = $state<Space[]>([
        {
            id: 'acme',
            name: 'Acme Studio',
            description: 'Client work, invoicing and shared assets.',
            color: USER_COLORS[0],
            projects: 3,
            hours: 390,
            members: [
                { id: 'm1', name: 'Camille', email: 'camille@facile.studio', role: 'owner' },
                { id: 'm2', name: 'Noah', email: 'noah@facile.studio', role: 'admin' },
                { id: 'm3', name: 'Mazouz', email: 'mazouz@facile.studio', role: 'neutral' },
                { id: 'm4', name: 'Yann', email: 'yann@facile.studio', role: 'neutral' }
            ]
        },
        {
            id: 'nova',
            name: 'Nova Collective',
            description: 'Side projects and experiments.',
            color: USER_COLORS[5],
            projects: 2,
            hours: 167,
            members: [{ id: 'm1', name: 'Camille', email: 'camille@facile.studio', role: 'owner' }]
        },
        {
            id: 'hedra',
            name: 'Hedra',
            description: 'Brand identity retainer.',
            color: USER_COLORS[2],
            projects: 0,
            hours: 0,
            members: []
        }
    ]);

    let selectedId = $state('acme');
    let activeSpaceId = $state<string | null>('acme');

    let createOpen = $state(false);
    let filtersOpen = $state(false);
    let confirmOpen = $state(false);
    let pendingRemoval = $state<Member | null>(null);

    let draftName = $state('');
    let draftDescription = $state('');
    let draftColor = $state(USER_COLORS[1] as string);

    let inviteEmail = $state('');
    let inviteRole = $state('neutral');
    let inviteSent = $state('');

    let roleFilter = $state('all');

    const roleLabel = { owner: 'Owner', admin: 'Admin', neutral: 'Member' };

    const selected = $derived(spaces.find((s) => s.id === selectedId) ?? spaces[0]);

    const switcherSpaces = $derived(spaces.map((s) => ({ id: s.id, name: s.name })));

    const visibleMembers = $derived(
        (selected?.members ?? []).filter((m) => roleFilter === 'all' || m.role === roleFilter)
    );

    function createSpace() {
        if (!draftName.trim()) return;
        const id = draftName.trim().toLowerCase().replace(/\s+/g, '-');
        spaces.push({
            id,
            name: draftName.trim(),
            description: draftDescription.trim(),
            color: draftColor,
            projects: 0,
            hours: 0,
            members: [{ id: 'm1', name: 'Camille', email: 'camille@facile.studio', role: 'owner' }]
        });
        selectedId = id;
        draftName = '';
        draftDescription = '';
        createOpen = false;
    }

    function invite() {
        if (!inviteEmail.trim() || !selected) return;
        selected.members.push({
            id: `m${selected.members.length + 1}`,
            name: inviteEmail.split('@')[0],
            email: inviteEmail.trim(),
            role: inviteRole as Role
        });
        inviteSent = `Invitation sent to ${inviteEmail.trim()}`;
        inviteEmail = '';
        setTimeout(() => (inviteSent = ''), 3000);
    }

    function askRemove(member: Member) {
        pendingRemoval = member;
        confirmOpen = true;
    }

    function confirmRemove() {
        if (!pendingRemoval || !selected) return;
        selected.members = selected.members.filter((m) => m.id !== pendingRemoval?.id);
        pendingRemoval = null;
    }
</script>

<div class="flex flex-col gap-10">
    <div class="flex flex-wrap items-start justify-between gap-4">
        <div class="flex min-w-0 flex-col gap-2">
            <h1 class="text-fc-2xl font-semibold text-fc-fg">Spaces</h1>
            <p class="text-fc-sm text-fc-fg-muted">
                Shared workspaces. Everyone in a space sees its projects, clients and tracked hours.
            </p>
        </div>
        <div class="flex items-center gap-3">
            <Button variant="outline" icon="solar:filter-linear" onclick={() => (filtersOpen = true)}>
                Filters
            </Button>
            <Button icon={icons.plus} onclick={() => (createOpen = true)}>New space</Button>
        </div>
    </div>

    <section class="flex flex-col gap-4">
        <div class="max-w-xs">
            <SpaceSwitcher
                spaces={switcherSpaces}
                activeId={activeSpaceId}
                onSelect={(id) => {
                    activeSpaceId = id;
                    if (id) selectedId = id;
                }}
                manageHref="#/spaces"
            />
        </div>

        <div class="flex flex-col gap-2">
            {#each spaces as space (space.id)}
                <Card class="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <button
                        type="button"
                        class="flex min-w-0 flex-1 items-center gap-3 text-left"
                        onclick={() => (selectedId = space.id)}
                        aria-pressed={space.id === selectedId}
                    >
                        <span
                            class="h-8 w-8 shrink-0 rounded-fc-pill"
                            style:background-color={space.color}
                        ></span>
                        <span class="min-w-0">
                            <span class="block truncate text-fc-sm font-medium text-fc-fg">{space.name}</span>
                            <span class="block truncate text-fc-xs text-fc-fg-muted">
                                {space.members.length} member{space.members.length === 1 ? '' : 's'} · {space.projects} projects
                            </span>
                        </span>
                    </button>
                    <div class="flex shrink-0 items-center gap-2">
                        {#if space.id === selectedId}<Badge tone="accent">Selected</Badge>{/if}
                        <Badge tone={space.members[0]?.role ?? 'neutral'}>
                            {roleLabel[space.members[0]?.role ?? 'neutral']}
                        </Badge>
                    </div>
                </Card>
            {/each}
        </div>
    </section>

    {#if selected}
        <section class="flex flex-col gap-4">
            <h2 class="text-fc-lg font-semibold text-fc-fg">{selected.name}</h2>
            <p class="text-fc-sm text-fc-fg-muted">{selected.description || 'No description yet.'}</p>

            <div class="grid gap-3 sm:grid-cols-3">
                <StatCard label="Members" value={selected.members.length} />
                <StatCard label="Projects" value={selected.projects} />
                <StatCard label="Hours tracked" value="{selected.hours} h" />
            </div>
        </section>

        <section class="flex flex-col gap-4">
            <h2 class="text-fc-lg font-semibold text-fc-fg">Members</h2>

            {#if visibleMembers.length === 0}
                <Card class="flex flex-col items-center gap-3 py-12 text-center">
                    <p class="text-fc-sm font-medium text-fc-fg">No one here yet</p>
                    <p class="text-fc-sm text-fc-fg-muted">
                        Invite a teammate below and they will see this space as soon as they accept.
                    </p>
                </Card>
            {:else}
                <Card class="flex flex-col gap-1 p-2">
                    {#each visibleMembers as member, i (member.id)}
                        {#if i > 0}<Divider />{/if}
                        <div class="flex items-center justify-between gap-3 px-2 py-2.5">
                            <div class="flex min-w-0 items-center gap-3">
                                <Avatar name={member.name} size="sm" />
                                <div class="min-w-0">
                                    <p class="truncate text-fc-sm font-medium text-fc-fg">{member.name}</p>
                                    <p class="truncate text-fc-xs text-fc-fg-muted">{member.email}</p>
                                </div>
                            </div>
                            <div class="flex shrink-0 items-center gap-2">
                                <Badge tone={member.role}>{roleLabel[member.role]}</Badge>
                                {#if member.role !== 'owner'}
                                    <Button
                                        variant="ghost-danger"
                                        size="sm"
                                        icon={icons.remove}
                                        aria-label="Remove {member.name}"
                                        onclick={() => askRemove(member)}
                                    >
                                        Remove
                                    </Button>
                                {/if}
                            </div>
                        </div>
                    {/each}
                </Card>
            {/if}
        </section>

        <section class="flex flex-col gap-4">
            <h2 class="text-fc-lg font-semibold text-fc-fg">Invite a teammate</h2>
            {#if inviteSent}
                <Alert tone="success">{inviteSent}</Alert>
            {/if}
            <div class="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div class="min-w-0 flex-1">
                    <Field label="Email">
                        <Input bind:value={inviteEmail} type="email" placeholder="teammate@facile.studio" />
                    </Field>
                </div>
                <Field label="Role">
                    <Select bind:value={inviteRole} class="min-w-36">
                        <option value="neutral">Member</option>
                        <option value="admin">Admin</option>
                    </Select>
                </Field>
                <Button icon={icons.plus} onclick={invite}>Send invite</Button>
            </div>
        </section>
    {/if}
</div>

<Modal bind:open={createOpen} title="New space" showClose>
    <div class="flex flex-col gap-4">
        <Field label="Name">
            <Input bind:value={draftName} placeholder="Acme Studio" />
        </Field>
        <Field label="Description" helper="Optional — what the space is for.">
            <Textarea bind:value={draftDescription} rows={3} placeholder="Client work and shared assets." />
        </Field>
        <Field label="Colour">
            <ColorPicker bind:value={draftColor} />
        </Field>
    </div>
    {#snippet footer()}
        <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" class="w-full sm:w-auto" onclick={() => (createOpen = false)}>Cancel</Button>
            <Button icon={icons.plus} class="w-full sm:w-auto" onclick={createSpace}>Create space</Button>
        </div>
    {/snippet}
</Modal>

<ConfirmModal
    bind:open={confirmOpen}
    tone="danger"
    title="Remove {pendingRemoval?.name ?? 'this member'}?"
    description="They lose access to every project in this space. Their tracked hours are kept."
    confirmLabel="Remove member"
    onconfirm={confirmRemove}
    oncancel={() => (pendingRemoval = null)}
/>

<Drawer bind:open={filtersOpen} title="Filters" description="Narrow the member list." showClose>
    <Field label="Role">
        <Select bind:value={roleFilter}>
            <option value="all">All roles</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
            <option value="neutral">Member</option>
        </Select>
    </Field>
    {#snippet footer()}
        <div class="flex gap-2">
            <Button variant="ghost" icon={icons.refresh} class="flex-1" onclick={() => (roleFilter = 'all')}>
                Reset
            </Button>
            <Button icon="mdi:check" class="flex-1" onclick={() => (filtersOpen = false)}>Apply</Button>
        </div>
    {/snippet}
</Drawer>

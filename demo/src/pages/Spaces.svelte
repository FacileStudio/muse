<script lang="ts">
    import {
        Alert,
        Badge,
        Button,
        Card,
        ColorPicker,
        ConfirmModal,
        Drawer,
        EmptyState,
        Field,
        Input,
        Modal,
        NavButton,
        Select,
        SettingsRow,
        SpaceSwitcher,
        StatCard,
        Textarea,
        USER_COLORS,
        icons
    } from '@facile/muse';
    import {
        createWorkspaces,
        currentUser,
        newMember,
        roleLabel,
        roleTone,
        type Member,
        type Role,
        type Workspace
    } from '../data.js';

    let spaces = $state<Workspace[]>(createWorkspaces());

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
    let inviteRole = $state<Role>('member');
    let inviteSent = $state('');

    let roleFilter = $state('all');

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
            members: [{ id: 'm1', name: currentUser.name, email: currentUser.email, role: 'owner' }]
        });
        selectedId = id;
        draftName = '';
        draftDescription = '';
        createOpen = false;
    }

    function invite() {
        if (!inviteEmail.trim() || !selected) return;
        selected.members.push(
            newMember(`m${selected.members.length + 1}`, inviteEmail.trim(), inviteRole)
        );
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
            <Button variant="outline" icon={icons.filter} onclick={() => (filtersOpen = true)}>
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

        <Card class="flex flex-col gap-1 p-2">
            {#each spaces as space (space.id)}
                <NavButton
                    icon={icons.usersGroup}
                    label={space.name}
                    active={space.id === selectedId}
                    aria-pressed={space.id === selectedId}
                    onclick={() => (selectedId = space.id)}
                >
                    {#snippet right()}
                        <span class="flex shrink-0 items-center gap-2">
                            <span class="hidden text-fc-xs opacity-70 sm:inline">
                                {space.members.length} member{space.members.length === 1 ? '' : 's'} · {space.projects} projects
                            </span>
                            <span
                                class="h-2.5 w-2.5 shrink-0 rounded-fc-pill"
                                style:background-color={space.color}
                            ></span>
                        </span>
                    {/snippet}
                </NavButton>
            {/each}
        </Card>
    </section>

    {#if selected}
        <section class="flex flex-col gap-4">
            <h2 class="text-fc-lg font-semibold text-fc-fg">{selected.name}</h2>
            <p class="text-fc-sm text-fc-fg-muted">{selected.description || 'No description yet.'}</p>

            <div class="grid gap-4 sm:grid-cols-3">
                <StatCard label="Members" value={selected.members.length} />
                <StatCard label="Projects" value={selected.projects} />
                <StatCard label="Hours tracked" value="{selected.hours} h" />
            </div>
        </section>

        <section class="flex flex-col gap-4">
            <h2 class="text-fc-lg font-semibold text-fc-fg">Members</h2>

            {#if visibleMembers.length === 0}
                <EmptyState
                    icon={icons.usersGroup}
                    title="No one here yet"
                    description="Invite a teammate below and they will see this space as soon as they accept."
                />
            {:else}
                <!-- SettingsRow draws the rule on its own top edge and drops it on the first
                     child, so the list needs no manual Divider and no index. -->
                <Card class="flex flex-col">
                    {#each visibleMembers as member (member.id)}
                        <SettingsRow label={member.name} description={member.email}>
                            <Badge tone={roleTone[member.role]}>{roleLabel[member.role]}</Badge>
                            {#if member.role !== 'owner'}
                                <Button
                                    variant="ghost-danger"
                                    icon={icons.remove}
                                    aria-label="Remove {member.name}"
                                    onclick={() => askRemove(member)}
                                >
                                    Remove
                                </Button>
                            {/if}
                        </SettingsRow>
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
                        <option value="member">Member</option>
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
    onConfirm={confirmRemove}
    onCancel={() => (pendingRemoval = null)}
/>

<Drawer bind:open={filtersOpen} title="Filters" description="Narrow the member list." showClose>
    <Field label="Role">
        <Select bind:value={roleFilter}>
            <option value="all">All roles</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
            <option value="member">Member</option>
        </Select>
    </Field>
    {#snippet footer()}
        <div class="flex gap-2">
            <Button variant="ghost" icon={icons.refresh} class="flex-1" onclick={() => (roleFilter = 'all')}>
                Reset
            </Button>
            <Button icon={icons.check} class="flex-1" onclick={() => (filtersOpen = false)}>Apply</Button>
        </div>
    {/snippet}
</Drawer>

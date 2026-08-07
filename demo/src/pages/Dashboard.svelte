<script lang="ts">
    import {
        Badge,
        BarChart,
        Button,
        Card,
        ConfirmModal,
        DonutChart,
        Drawer,
        Field,
        Input,
        LineChart,
        Modal,
        Sparkline,
        SpaceSwitcher,
        Spinner,
        StatCard,
        Switch,
        icons
    } from '@facile/lib';

    let notify = $state(true);
    let email = $state('');
    let activeSpaceId = $state<string | null>('acme');
    let modalOpen = $state(false);
    let confirmOpen = $state(false);
    let deleteOpen = $state(false);
    let drawerOpen = $state(false);
    let lastAction = $state('nothing yet');

    const spaces = [
        { id: 'acme', name: 'Acme Studio' },
        { id: 'nova', name: 'Nova Collective' }
    ];

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

    const tracked = [
        { name: 'Billable', data: [88, 102, 96, 124, 118, 141, 133, 152] },
        { name: 'Internal', data: [41, 38, 52, 44, 61, 49, 58, 47] }
    ];

    const invoices = [
        { name: 'Paid', data: [12, 15, 11, 18, 21, 17, 24, 26] },
        { name: 'Pending', data: [4, 3, 6, 5, 2, 7, 4, 3] },
        { name: 'Overdue', data: [1, 2, 1, 0, 3, 1, 2, 1] }
    ];

    const storage = [
        { label: 'Documents', value: 412 },
        { label: 'Media', value: 268 },
        { label: 'Backups', value: 155 },
        { label: 'Other', value: 61 }
    ];

    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    async function deleteSpace() {
        await wait(1200);
        lastAction = 'deleted Nova Collective';
    }
</script>

<div class="flex flex-col gap-10">
    <div class="flex flex-col gap-2">
        <h1 class="text-fc-2xl font-semibold text-fc-fg">Dashboard</h1>
        <p class="text-fc-sm text-fc-fg-muted">
            Overview of the current space, and a gallery of the primitives every Facile tool shares.
        </p>
    </div>

    <section class="flex flex-col gap-4">
        <div class="grid gap-3 sm:grid-cols-3">
            <StatCard label="Tracked" value="1 054 h" delta="+12% vs last month">
                <Sparkline data={tracked[0].data} class="mt-2" showLast />
            </StatCard>
            <StatCard label="Invoiced" value="€48.2k" delta="+8% vs last month">
                <Sparkline data={invoices[0].data} color="var(--color-fc-chart-5)" class="mt-2" showLast />
            </StatCard>
            <StatCard label="Overdue" value="10" delta="−3 vs last month">
                <Sparkline data={invoices[2].data} color="var(--color-fc-chart-2)" class="mt-2" showLast />
            </StatCard>
        </div>

        <Card class="flex flex-col gap-3">
            <p class="text-fc-sm font-medium text-fc-fg">Hours tracked per month</p>
            <LineChart series={tracked} labels={months} area height={240} />
        </Card>

        <div class="grid gap-3 lg:grid-cols-2">
            <Card class="flex flex-col gap-3">
                <p class="text-fc-sm font-medium text-fc-fg">Invoices by status</p>
                <BarChart series={invoices} labels={months} stacked height={220} />
            </Card>
            <Card class="flex flex-col gap-3">
                <p class="text-fc-sm font-medium text-fc-fg">Storage used</p>
                <DonutChart data={storage} centerLabel="of 1 TB used" valueFormat={(n) => `${n} GB`} />
            </Card>
        </div>

        <Card class="flex flex-col gap-3">
            <p class="text-fc-sm font-medium text-fc-fg">Top clients</p>
            <BarChart
                series={[{ name: 'Revenue', data: [24, 18, 15, 11, 7] }]}
                labels={['Acme', 'Nova', 'Hedra', 'Lumen', 'Pivot']}
                horizontal
                height={200}
                yFormat={(n) => `€${n}k`}
            />
        </Card>
    </section>

    <section class="flex flex-col gap-4">
        <h2 class="text-fc-lg font-semibold text-fc-fg">Buttons</h2>
        <div class="flex flex-wrap items-center gap-3">
            <Button variant="primary" size="sm" icon={icons.plus}>Create</Button>
            <Button variant="primary" size="md" icon={icons.plus}>New project</Button>
            <Button variant="primary" size="lg" icon={icons.plus}>New space</Button>
        </div>
        <div class="flex flex-wrap items-center gap-3">
            <Button variant="outline" icon={icons.edit}>Edit</Button>
            <Button variant="outline" icon={icons.upload}>Upload</Button>
            <Button variant="ghost" icon={icons.settings}>Settings</Button>
            <Button variant="danger" icon={icons.remove}>Delete</Button>
            <Button variant="primary" disabled icon={icons.logout}>Disabled</Button>
        </div>
    </section>

    <section class="flex flex-col gap-4">
        <h2 class="text-fc-lg font-semibold text-fc-fg">Badges</h2>
        <div class="flex flex-wrap items-center gap-2">
            <Badge tone="neutral">Member</Badge>
            <Badge tone="owner">Owner</Badge>
            <Badge tone="admin">Admin</Badge>
            <Badge tone="accent">Accent</Badge>
            <Badge tone="success">Active</Badge>
            <Badge tone="danger">Revoked</Badge>
        </div>
    </section>

    <section class="flex flex-col gap-4">
        <h2 class="text-fc-lg font-semibold text-fc-fg">Form controls</h2>
        <div class="flex max-w-sm flex-col gap-4">
            <Field label="Email" helper="Used for space invitations.">
                <Input bind:value={email} placeholder="you@facile.studio" type="email" />
            </Field>
            <Switch bind:checked={notify} label="Email notifications" class="text-fc-sm" />
            <div class="flex items-center gap-3 text-fc-sm text-fc-fg-muted">
                <Spinner size="sm" /> Loading state
            </div>
        </div>
    </section>

    <section class="flex flex-col gap-4">
        <h2 class="text-fc-lg font-semibold text-fc-fg">Overlays</h2>
        <p class="text-fc-sm text-fc-fg-muted">Last action: {lastAction}</p>
        <div class="flex flex-wrap items-center gap-3">
            <Button variant="outline" icon={icons.plus} onclick={() => (modalOpen = true)}>Invite</Button>
            <Button variant="outline" icon="solar:upload-linear" onclick={() => (confirmOpen = true)}>
                Publish
            </Button>
            <Button variant="danger" icon={icons.remove} onclick={() => (deleteOpen = true)}>
                Delete space
            </Button>
            <Button variant="outline" icon="solar:filter-linear" onclick={() => (drawerOpen = true)}>
                Filters
            </Button>
        </div>
    </section>

    <section class="flex flex-col gap-4">
        <h2 class="text-fc-lg font-semibold text-fc-fg">SpaceSwitcher</h2>
        <div class="max-w-xs">
            <SpaceSwitcher
                {spaces}
                activeId={activeSpaceId}
                onSelect={(id) => (activeSpaceId = id)}
                manageHref="#/spaces"
            />
        </div>
    </section>
</div>

<Modal bind:open={modalOpen} title="Invite a teammate" showClose>
    <p class="text-fc-sm text-fc-fg-muted">
        They receive an email invitation and join with the Member role.
    </p>
    <Field label="Email">
        <Input placeholder="you@facile.studio" type="email" />
    </Field>
    {#snippet footer()}
        <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" class="w-full sm:w-auto" onclick={() => (modalOpen = false)}>
                Cancel
            </Button>
            <Button
                icon="solar:letter-linear"
                class="w-full sm:w-auto"
                onclick={() => {
                    modalOpen = false;
                    lastAction = 'sent an invitation';
                }}
            >
                Send invite
            </Button>
        </div>
    {/snippet}
</Modal>

<ConfirmModal
    bind:open={confirmOpen}
    title="Publish this report?"
    description="Everyone in Acme Studio will be able to read it."
    confirmLabel="Publish"
    onconfirm={() => (lastAction = 'published the report')}
    oncancel={() => (lastAction = 'cancelled the publish')}
/>

<ConfirmModal
    bind:open={deleteOpen}
    tone="danger"
    title="Delete Nova Collective?"
    description="This removes the space, its members and every tracked entry. This cannot be undone."
    confirmLabel="Delete space"
    onconfirm={deleteSpace}
    oncancel={() => (lastAction = 'kept Nova Collective')}
/>

<Drawer
    bind:open={drawerOpen}
    title="Filters"
    description="Drag the handle down, or press Escape, to dismiss."
    showClose
>
    <div class="flex flex-col gap-4">
        <Field label="Client">
            <Input placeholder="All clients" />
        </Field>
        <Switch checked label="Billable only" class="text-fc-sm" />
        <Switch label="Include archived" class="text-fc-sm" />
        <div class="flex flex-wrap gap-2">
            {#each ['7 days', '30 days', 'Quarter', 'Year'] as range (range)}
                <Badge tone="neutral">{range}</Badge>
            {/each}
        </div>
    </div>
    {#snippet footer()}
        <div class="flex gap-2">
            <Button variant="ghost" icon={icons.refresh} class="flex-1" onclick={() => (drawerOpen = false)}>
                Reset
            </Button>
            <Button
                icon="mdi:check"
                class="flex-1"
                onclick={() => {
                    drawerOpen = false;
                    lastAction = 'applied filters';
                }}
            >
                Apply
            </Button>
        </div>
    {/snippet}
</Drawer>

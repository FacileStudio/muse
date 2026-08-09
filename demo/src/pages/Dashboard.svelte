<script lang="ts">
    import {
        Alert,
        Badge,
        BarChart,
        Button,
        Card,
        chartColor,
        ChartLegend,
        ChartTooltip,
        Checkbox,
        ConfirmModal,
        DonutChart,
        Drawer,
        Field,
        IconButton,
        icons,
        Input,
        LineChart,
        Modal,
        Page,
        PageHeader,
        Radio,
        SpaceSwitcher,
        Sparkline,
        Spinner,
        StatCard,
        StatusDot,
        Switch,
        toast,
        Toast
    } from '@facile/muse';
    import { spaces, wait } from '../data.js';

    let notify = $state(true);
    let email = $state('');
    let billing = $state('camille.facile.studio');
    let digest = $state('weekly');
    let scopes = $state({ projects: true, invoices: false, exports: true });
    let activeSpaceId = $state<string | null>('acme');
    let modalOpen = $state(false);
    let confirmOpen = $state(false);
    let deleteOpen = $state(false);
    let drawerOpen = $state(false);
    let lastAction = $state('nothing yet');
    let seats = $state(3);

    const cardLinks = [
        { href: '#/projects', label: 'Projects', meta: '12 active', icon: icons.folder },
        { href: '#/spaces', label: 'Spaces', meta: '3 spaces', icon: icons.usersGroup },
        { href: '#/settings', label: 'Settings', meta: 'Profile and API', icon: icons.settings }
    ];

    const billingError = $derived(
        billing.length > 0 && !billing.includes('@') ? 'An email address needs an @.' : undefined
    );

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

    const legend = storage.map((slice, i) => ({
        name: slice.label,
        color: chartColor(i),
        value: `${slice.value} GB`
    }));

    const tipRows = [
        { name: 'Billable', value: '152 h', color: chartColor(0) },
        { name: 'Internal', value: '47 h', color: chartColor(1) }
    ];

    async function deleteSpace() {
        await wait(1200);
        lastAction = 'deleted Nova Collective';
    }
</script>

<Page width="xl">
    <PageHeader
        title="Dashboard"
        description="Overview of the current space, and a gallery of the primitives every Facile tool shares."
    />

    <!-- One rhythm for the whole page: 40px between sections, 16px between the cards of a
         section, 20px of card padding, and a section's heading bound to its body by the
         same 16px. Card gutters used to be 12px — tighter than the padding inside the cards
         they separate, which reads as three panels leaning on each other. -->
    <section class="flex flex-col gap-4">
        <div class="grid gap-4 sm:grid-cols-3">
            <StatCard label="Tracked" value="1 054 h" delta="+12% vs last month">
                <Sparkline data={tracked[0].data} class="mt-3" showLast />
            </StatCard>
            <StatCard label="Invoiced" value="€48.2k" delta="+8% vs last month">
                <Sparkline data={invoices[0].data} color="var(--color-fc-chart-5)" class="mt-3" showLast />
            </StatCard>
            <StatCard label="Overdue" value="10" delta="−3 vs last month">
                <Sparkline data={invoices[2].data} color="var(--color-fc-chart-2)" class="mt-3" showLast />
            </StatCard>
        </div>

        <Card class="flex flex-col gap-4">
            <p class="text-fc-sm font-medium text-fc-fg">Hours tracked per month</p>
            <LineChart series={tracked} labels={months} area height={240} />
        </Card>

        <div class="grid gap-4 lg:grid-cols-2">
            <Card class="flex flex-col gap-4">
                <p class="text-fc-sm font-medium text-fc-fg">Invoices by status</p>
                <BarChart series={invoices} labels={months} stacked height={220} />
            </Card>
            <Card class="flex flex-col gap-4">
                <p class="text-fc-sm font-medium text-fc-fg">Storage used</p>
                <!-- flex-1 so the ring centres in the height the taller neighbour sets,
                     instead of hanging off the title. -->
                <DonutChart
                    data={storage}
                    centerLabel="of 1 TB used"
                    valueFormat={(n) => `${n} GB`}
                    class="flex-1"
                />
            </Card>
        </div>

        <Card class="flex flex-col gap-4">
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
        <div class="flex flex-col gap-1">
            <h2 class="text-fc-lg font-semibold text-fc-fg">Chart parts</h2>
            <p class="text-fc-sm text-fc-fg-muted">
                The legend and the tooltip are exported separately, so a chart muse does not ship
                can still read as one of ours.
            </p>
        </div>
        <div class="grid gap-4 lg:grid-cols-2">
            <Card class="flex flex-col gap-4">
                <p class="text-fc-sm font-medium text-fc-fg">ChartLegend</p>
                <ChartLegend items={legend} />
            </Card>
            <Card class="relative flex min-h-32 flex-col gap-4">
                <p class="text-fc-sm font-medium text-fc-fg">ChartTooltip</p>
                <ChartTooltip x={120} y={80} title="Aug" rows={tipRows} visible />
            </Card>
        </div>
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
        <div class="flex flex-wrap items-center gap-3">
            <IconButton variant="default" aria-label="Edit" title="Default">
                <iconify-icon icon={icons.edit} width="18" height="18" class="block"></iconify-icon>
            </IconButton>
            <IconButton variant="ghost" aria-label="Refresh" title="Ghost">
                <iconify-icon icon={icons.refresh} width="18" height="18" class="block"></iconify-icon>
            </IconButton>
            <IconButton variant="danger" aria-label="Delete" title="Danger">
                <iconify-icon icon={icons.remove} width="18" height="18" class="block"></iconify-icon>
            </IconButton>
            <!-- icons.minus is the pair to icons.plus: MDI, because Solar's reads muddy at
                 16px. A stepper is where it earns its keep. -->
            <div class="flex items-center gap-2">
                <IconButton variant="ghost" aria-label="Fewer" onclick={() => (seats = Math.max(1, seats - 1))}>
                    <iconify-icon icon={icons.minus} width="18" height="18" class="block"></iconify-icon>
                </IconButton>
                <span class="w-6 text-center text-fc-sm tabular-nums text-fc-fg">{seats}</span>
                <IconButton variant="ghost" aria-label="More" onclick={() => (seats = seats + 1)}>
                    <iconify-icon icon={icons.plus} width="18" height="18" class="block"></iconify-icon>
                </IconButton>
            </div>
        </div>

        <!-- An action that navigates renders as an <a> and keeps the button's shape, so it is
             still middle-clickable and still shows its target in the status bar. -->
        <div class="flex flex-wrap items-center gap-3">
            <Button href="#/projects" iconRight={icons.arrow}>All projects</Button>
            <Button href="#/spaces" variant="outline" icon={icons.usersGroup}>Spaces</Button>
            <Button href="#/motion" variant="ghost" iconRight={icons.arrow}>Motion</Button>
            <Button href="#/settings" disabled iconRight={icons.arrow}>Disabled link</Button>
        </div>
    </section>

    <section class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
            <h2 class="text-fc-lg font-semibold text-fc-fg">Cards that navigate</h2>
            <p class="text-fc-sm text-fc-fg-muted">
                `href` turns a Card into an anchor and adds the hover step, the focus ring and
                `group`, so children can answer the hover.
            </p>
        </div>
        <div class="grid gap-4 sm:grid-cols-3">
            {#each cardLinks as link (link.href)}
                <Card href={link.href} class="flex flex-col gap-4">
                    <div class="flex items-center justify-between">
                        <span
                            class="flex size-9 items-center justify-center rounded-fc-sm bg-fc-surface text-fc-fg transition-colors group-hover:bg-fc-component"
                        >
                            <iconify-icon icon={link.icon} width="18" height="18" class="block"></iconify-icon>
                        </span>
                        <iconify-icon
                            icon={icons.arrow}
                            width="16"
                            height="16"
                            class="block text-fc-fg-muted transition-transform group-hover:translate-x-0.5"
                        ></iconify-icon>
                    </div>
                    <div class="min-w-0">
                        <p class="truncate text-fc-sm font-medium text-fc-fg">{link.label}</p>
                        <p class="truncate text-fc-xs text-fc-fg-muted">{link.meta}</p>
                    </div>
                </Card>
            {/each}
        </div>
    </section>

    <section class="flex flex-col gap-4">
        <h2 class="text-fc-lg font-semibold text-fc-fg">Tones</h2>
        <div class="flex flex-wrap items-center gap-2">
            <Badge tone="neutral">Member</Badge>
            <Badge tone="owner">Owner</Badge>
            <Badge tone="admin">Admin</Badge>
            <Badge tone="accent">Accent</Badge>
            <Badge tone="info">Beta</Badge>
            <Badge tone="success">Active</Badge>
            <Badge tone="warning">Expiring</Badge>
            <Badge tone="danger">Revoked</Badge>
        </div>
        <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
            <StatusDot tone="neutral" label="Idle" />
            <StatusDot tone="accent" label="Selected" />
            <StatusDot tone="info" label="Syncing" />
            <StatusDot tone="success" label="Connected" />
            <StatusDot tone="warning" label="Reconnecting" pulse />
            <StatusDot tone="danger" label="Offline" />
        </div>
        <div class="grid gap-2 lg:grid-cols-2">
            <Alert tone="neutral">Neutral — context, no state attached to it.</Alert>
            <Alert tone="info">Info — something worth knowing, nothing to do about it.</Alert>
            <Alert tone="success">Success — the thing you asked for happened.</Alert>
            <Alert tone="warning" title="Warning">Something needs a decision before long.</Alert>
            <Alert tone="danger" title="Danger">Something failed and is still failing.</Alert>
        </div>
    </section>

    <section class="flex flex-col gap-4">
        <h2 class="text-fc-lg font-semibold text-fc-fg">Form controls</h2>
        <div class="flex max-w-sm flex-col gap-4">
            <Field label="Email" helper="Used for space invitations.">
                <Input bind:value={email} placeholder="you@facile.studio" type="email" />
            </Field>

            <!-- Field owns the id, the description and the invalid flag; the Input picks all
                 three up from context, so this is a labelled, described, aria-invalid control
                 with nothing wired by hand. -->
            <Field
                label="Billing email"
                error={billingError}
                helper="Invoices and payment receipts go here."
            >
                <Input bind:value={billing} placeholder="billing@facile.studio" type="email" />
            </Field>

            <fieldset class="flex flex-col gap-2">
                <legend class="mb-1 text-fc-sm text-fc-fg">Export scopes</legend>
                <Checkbox bind:checked={scopes.projects} label="Projects and tasks" />
                <Checkbox bind:checked={scopes.invoices} label="Invoices" />
                <Checkbox bind:checked={scopes.exports} label="Tracked time" />
            </fieldset>

            <fieldset class="flex flex-col gap-2">
                <legend class="mb-1 text-fc-sm text-fc-fg">Digest frequency</legend>
                <Radio bind:group={digest} value="daily" name="digest" label="Every morning" />
                <Radio bind:group={digest} value="weekly" name="digest" label="Monday mornings" />
                <Radio bind:group={digest} value="never" name="digest" label="Never" />
            </fieldset>

            <Switch bind:checked={notify} label="Email notifications" class="text-fc-sm" />
            <div class="flex items-center gap-3 text-fc-sm text-fc-fg-muted">
                <Spinner size="sm" /> Loading state
            </div>
        </div>
    </section>

    <section class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
            <h2 class="text-fc-lg font-semibold text-fc-fg">Overlays</h2>
            <p class="text-fc-sm text-fc-fg-muted">Last action: {lastAction}</p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
            <Button variant="outline" icon={icons.plus} onclick={() => (modalOpen = true)}>Invite</Button>
            <Button variant="outline" icon={icons.upload} onclick={() => (confirmOpen = true)}>
                Publish
            </Button>
            <Button variant="danger" icon={icons.remove} onclick={() => (deleteOpen = true)}>
                Delete space
            </Button>
            <Button variant="outline" icon={icons.filter} onclick={() => (drawerOpen = true)}>
                Filters
            </Button>
        </div>
    </section>

    <section class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
            <h2 class="text-fc-lg font-semibold text-fc-fg">Toasts</h2>
            <p class="text-fc-sm text-fc-fg-muted">
                Feedback that does not need an answer. Call <code>toast.success(…)</code> from
                anywhere — the single <code>&lt;Toaster /&gt;</code> in the layout renders it.
            </p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
            <Button
                variant="outline"
                icon={icons.check}
                onclick={() => toast.success('Invoice sent to Acme Studio.')}
            >
                Success
            </Button>
            <Button
                variant="outline"
                icon={icons.info}
                onclick={() => toast.info('Export queued — the link arrives by email.')}
            >
                Info
            </Button>
            <Button
                variant="outline"
                icon={icons.warning}
                onclick={() => toast.warning('Two invoices are past their due date.', { title: 'Overdue' })}
            >
                Warning
            </Button>
            <Button
                variant="danger"
                icon={icons.error}
                onclick={() =>
                    toast.danger('Could not reach the server. Nothing was saved.', {
                        title: 'Sync failed',
                        duration: 8000
                    })}
            >
                Danger
            </Button>
            <Button
                variant="outline"
                icon={icons.remove}
                onclick={() =>
                    toast.neutral('Deleted “Nova rebrand”.', {
                        action: { label: 'Undo', onClick: () => toast.success('Restored “Nova rebrand”.') }
                    })}
            >
                With an action
            </Button>
            <Button variant="ghost" icon={icons.refresh} onclick={() => toast.clear()}>Clear</Button>
        </div>
        <!-- The same component, sitting still, so the anatomy is readable without chasing a
             five-second timer. -->
        <div class="flex max-w-sm flex-col gap-3">
            <Toast tone="success" title="Invoice sent">Acme Studio · €4 200 · due in 30 days.</Toast>
            <Toast
                tone="neutral"
                action={{ label: 'Undo', onClick: () => toast.success('Restored “Nova rebrand”.') }}
            >
                Deleted “Nova rebrand”.
            </Toast>
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
</Page>

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
                icon={icons.mail}
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
    onConfirm={() => {
        lastAction = 'published the report';
    }}
    onCancel={() => (lastAction = 'cancelled the publish')}
/>

<ConfirmModal
    bind:open={deleteOpen}
    tone="danger"
    title="Delete Nova Collective?"
    description="This removes the space, its members and every tracked entry. This cannot be undone."
    confirmLabel="Delete space"
    onConfirm={deleteSpace}
    onCancel={() => (lastAction = 'kept Nova Collective')}
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
                icon={icons.check}
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

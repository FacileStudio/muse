<script lang="ts">
    import {
        Badge,
        BarChart,
        Button,
        Card,
        chartColor,
        SwatchPicker,
        ConfirmModal,
        Drawer,
        EmptyState,
        Field,
        Icon,
        IconButton,
        icons,
        Input,
        ListItem,
        Modal,
        Page,
        PageHeader,
        Select,
        Skeleton,
        Sparkline,
        StatCard,
        Switch,
        USER_COLORS
    } from '@facile/muse';

    type Status = 'active' | 'paused' | 'done';

    type Project = {
        id: string;
        name: string;
        client: string;
        space: string;
        status: Status;
        hours: number;
        color: string;
        trend: number[];
    };

    let projects = $state<Project[]>([
        { id: 'p1', name: 'Refonte site vitrine', client: 'Acme Studio', space: 'Acme Studio', status: 'active', hours: 142, color: USER_COLORS[0], trend: [8, 12, 9, 16, 14, 19, 22, 24] },
        { id: 'p2', name: 'Application mobile', client: 'Nova Collective', space: 'Nova Collective', status: 'active', hours: 96, color: USER_COLORS[1], trend: [4, 6, 11, 9, 14, 12, 17, 18] },
        { id: 'p3', name: 'Identité de marque', client: 'Hedra', space: 'Acme Studio', status: 'paused', hours: 38, color: USER_COLORS[2], trend: [6, 9, 7, 5, 4, 3, 4, 2] },
        { id: 'p4', name: 'Dashboard analytique', client: 'Lumen', space: 'Nova Collective', status: 'active', hours: 71, color: USER_COLORS[3], trend: [2, 5, 8, 9, 12, 11, 14, 16] },
        { id: 'p5', name: 'Migration infra', client: 'Pivot', space: 'Acme Studio', status: 'done', hours: 210, color: USER_COLORS[4], trend: [24, 26, 22, 19, 15, 9, 5, 1] }
    ]);

    let search = $state('');
    let sort = $state('name');
    let statusFilter = $state('all');
    let billableOnly = $state(false);
    let loading = $state(false);

    let createOpen = $state(false);
    let filtersOpen = $state(false);
    let pendingDelete = $state<Project | null>(null);
    let confirmOpen = $state(false);

    let draftName = $state('');
    let draftClient = $state('');
    let draftSpace = $state('Acme Studio');
    let draftColor = $state(USER_COLORS[0] as string);

    const statusTone = { active: 'success', paused: 'neutral', done: 'accent' } as const;
    const statusLabel = { active: 'Active', paused: 'Paused', done: 'Delivered' };

    const visible = $derived.by(() => {
        const q = search.trim().toLowerCase();
        const rows = projects.filter((p) => {
            if (statusFilter !== 'all' && p.status !== statusFilter) return false;
            if (!q) return true;
            return p.name.toLowerCase().includes(q) || p.client.toLowerCase().includes(q);
        });
        return rows.sort((a, b) => (sort === 'hours' ? b.hours - a.hours : a.name.localeCompare(b.name)));
    });

    const totalHours = $derived(projects.reduce((sum, p) => sum + p.hours, 0));
    const activeCount = $derived(projects.filter((p) => p.status === 'active').length);

    const chartSeries = $derived([
        { name: 'Hours', data: visible.map((p) => p.hours) }
    ]);
    const chartLabels = $derived(visible.map((p) => p.name));

    function createProject() {
        if (!draftName.trim()) return;
        projects.push({
            id: `p${projects.length + 1}`,
            name: draftName.trim(),
            client: draftClient.trim() || '—',
            space: draftSpace,
            status: 'active',
            hours: 0,
            color: draftColor,
            trend: [0, 0, 0, 0, 0, 0, 0, 1]
        });
        draftName = '';
        draftClient = '';
        createOpen = false;
    }

    function askDelete(project: Project) {
        pendingDelete = project;
        confirmOpen = true;
    }

    function confirmDelete() {
        if (!pendingDelete) return;
        projects = projects.filter((p) => p.id !== pendingDelete?.id);
        pendingDelete = null;
    }
</script>

<svelte:window
    onkeydown={(e) => {
        if (e.key !== '/' || (e.target as HTMLElement).closest('input, textarea, select, [contenteditable]'))
            return;

        e.preventDefault();
        document.querySelector<HTMLInputElement>('[aria-label="Search projects"]')?.focus();
    }}
/>

<Page>
    <PageHeader
        title="Projects"
        count={projects.length}
        description="Every project across your spaces, with the hours tracked against each one."
    >
        {#snippet actions()}
            <Input bind:value={search} placeholder="Search projects or clients…" aria-label="Search projects" shortcut="/" class="w-64" />
            <Select bind:value={sort} class="w-36" aria-label="Sort projects">
                <option value="name">Sort by name</option>
                <option value="hours">Sort by hours</option>
            </Select>
            <Button variant="outline" icon={icons.filter} onclick={() => (filtersOpen = true)}>Filters</Button>
            <Button icon={icons.plus} onclick={() => (createOpen = true)}>New project</Button>
        {/snippet}
    </PageHeader>

    <section class="grid gap-1 sm:grid-cols-3">
        <StatCard label="Active" value={activeCount} delta="of {projects.length} projects">
            <Sparkline data={projects[0]?.trend ?? []} color={chartColor(0, 3)} class="mt-2" showLast />
        </StatCard>
        <StatCard label="Hours tracked" value="{totalHours} h" delta="+18% vs last month">
            <Sparkline data={projects[1]?.trend ?? []} color={chartColor(1, 3)} class="mt-2" showLast />
        </StatCard>
        <StatCard label="Billable ratio" value="78%" delta="+4 pts vs last month">
            <Sparkline data={projects[3]?.trend ?? []} color={chartColor(2, 3)} class="mt-2" showLast />
        </StatCard>
    </section>

    <section class="flex flex-col gap-1">
        {#if loading}
            <div class="flex flex-col gap-1">
                {#each [0, 1, 2, 3] as row (row)}
                    <Skeleton class="h-14 w-full" />
                {/each}
            </div>
        {:else if visible.length === 0}
            <EmptyState
                icon={icons.search}
                title="No project matches “{search}”"
                description="Try another name, or clear the filters."
            >
                <Button variant="outline" icon={icons.refresh} onclick={() => { search = ''; statusFilter = 'all'; }}>
                    Clear filters
                </Button>
            </EmptyState>
        {:else}
            <div class="flex flex-col gap-1">
                {#each visible as project (project.id)}
                    <ListItem title={project.name} description={project.client} href="#/projects" tint={project.color}>
                        {#snippet leading()}
                            <span class="block aspect-[16/10] h-full" style:background-color={project.color}></span>
                        {/snippet}
                        {#snippet meta()}
                            <span class="w-32 truncate">{project.space}</span>
                            <Sparkline data={project.trend} height={24} color={project.color} class="w-20" />
                            <span class="w-14 text-right">{project.hours} h</span>
                            <Badge tone={statusTone[project.status]}>{statusLabel[project.status]}</Badge>
                        {/snippet}
                        {#snippet actions()}
                            <IconButton
                                variant="danger"
                                aria-label="Delete {project.name}"
                                onclick={() => askDelete(project)}
                            >
                                <Icon icon={icons.remove} />
                            </IconButton>
                        {/snippet}
                    </ListItem>
                {/each}
            </div>
        {/if}

        <Switch bind:checked={loading} label="Simulate loading state" class="text-fc-p" />
    </section>

    <section class="flex flex-col gap-1">
        <Card class="flex flex-col gap-1">
            <p class="text-fc-p font-medium text-fc-ink">Hours per project</p>
            <BarChart
                series={chartSeries}
                labels={chartLabels}
                horizontal
                height={220}
                yFormat={(n) => `${n} h`}
            />
        </Card>
    </section>
</Page>

<Modal bind:open={createOpen} title="New project" showClose>
    <div class="flex flex-col gap-1">
        <Field label="Name">
            <Input bind:value={draftName} placeholder="Refonte site vitrine" />
        </Field>
        <Field label="Client">
            <Input bind:value={draftClient} placeholder="Acme Studio" />
        </Field>
        <Field label="Space">
            <Select bind:value={draftSpace}>
                <option value="Acme Studio">Acme Studio</option>
                <option value="Nova Collective">Nova Collective</option>
            </Select>
        </Field>
        <Field label="Colour">
            <SwatchPicker bind:value={draftColor} />
        </Field>
    </div>
    {#snippet footer()}
        <div class="flex flex-col-reverse gap-1 sm:flex-row sm:justify-end">
            <Button variant="ghost" class="w-full sm:w-auto" onclick={() => (createOpen = false)}>Cancel</Button>
            <Button icon={icons.plus} class="w-full sm:w-auto" onclick={createProject}>Create project</Button>
        </div>
    {/snippet}
</Modal>

<ConfirmModal
    bind:open={confirmOpen}
    tone="danger"
    title="Delete {pendingDelete?.name ?? 'this project'}?"
    description="Its tracked hours stay in the space history, but the project disappears from every list."
    confirmLabel="Delete project"
    onConfirm={confirmDelete}
    onCancel={() => (pendingDelete = null)}
/>

<Drawer bind:open={filtersOpen} title="Filters" description="Narrow the project list." showClose>
    <div class="flex flex-col gap-1">
        <Field label="Status">
            <Select bind:value={statusFilter}>
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="done">Delivered</option>
            </Select>
        </Field>
        <Switch bind:checked={billableOnly} label="Billable only" class="text-fc-p" />
    </div>
    {#snippet footer()}
        <div class="flex gap-1">
            <Button
                variant="ghost"
                icon={icons.refresh}
                class="flex-1"
                onclick={() => {
                    statusFilter = 'all';
                    billableOnly = false;
                }}
            >
                Reset
            </Button>
            <Button icon={icons.check} class="flex-1" onclick={() => (filtersOpen = false)}>Apply</Button>
        </div>
    {/snippet}
</Drawer>

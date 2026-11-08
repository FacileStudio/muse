<script lang="ts">
    import {
        ApprovalCard,
        IdeaCard,
        IdeasPage,
        IdeasUpsell,
        Page,
        PageHeader,
        RadioGroup,
        Section,
        countNewIdeas,
        type ApprovalRequest,
        type Idea,
        type IdeasLayout
    } from '@facile/muse';
    import { ideaFixtures, sampleApproval } from '../ideas.js';

    const modes = [
        { value: 'ready', label: 'Prêt' },
        { value: 'loading', label: 'Chargement' },
        { value: 'empty', label: 'Vide' },
        { value: 'busy', label: 'Génération' },
        { value: 'error', label: 'Erreur' },
        { value: 'upsell', label: 'Forfait gratuit' }
    ];

    let mode = $state('ready');
    let layout = $state<IdeasLayout>('grid');
    let ideas = $state<Idea[]>(ideaFixtures());
    let busyIds = $state<string[]>([]);
    let lastGeneratedAt = $state<number | null>(Date.now() - 2 * 3_600_000);
    let approvalBusy = $state(false);
    let approvalAnswer = $state('');

    const shown = $derived(mode === 'ready' || mode === 'error' ? ideas : []);
    const newCount = $derived(countNewIdeas(ideas));

    function patch(id: string, change: Partial<Idea>) {
        ideas = ideas.map((idea) => (idea.id === id ? { ...idea, ...change } : idea));
    }

    function settle(id: string, change: Partial<Idea>, ms = 1200) {
        busyIds = [...busyIds, id];
        setTimeout(() => {
            patch(id, change);
            busyIds = busyIds.filter((item) => item !== id);
        }, ms);
    }

    function run(idea: Idea) {
        patch(idea.id, { run: { state: 'running' } });
        setTimeout(() => patch(idea.id, { run: { state: 'needs_approval', approval: sampleApproval(idea.id) } }), 1500);
    }

    function approve(idea: Idea) {
        settle(idea.id, {
            run: {
                state: 'done',
                summary: 'Le brouillon est enregistré et la tâche de suivi est créée.',
                outputs: [{ label: 'Ouvrir le brouillon', href: '/#/ideas' }]
            }
        });
    }

    function decline(idea: Idea) {
        settle(idea.id, { run: undefined });
    }

    function dismiss(idea: Idea) {
        ideas = ideas.filter((item) => item.id !== idea.id);
    }

    function generate() {
        mode = 'busy';
        setTimeout(() => {
            ideas = ideaFixtures();
            lastGeneratedAt = Date.now();
            mode = 'ready';
        }, 2000);
    }

    function answerApproval(label: string, _approval: ApprovalRequest) {
        approvalBusy = true;
        setTimeout(() => {
            approvalBusy = false;
            approvalAnswer = label;
        }, 1000);
    }
</script>

<Page>
    <PageHeader
        title="Idées"
        description="Le kit des idées : la page, la carte, l'état d'un run, la carte d'accord et l'invite pour un forfait sans IA. Les composants ne chargent rien : cette page joue le rôle de l'app."
    />

    <Section title="La page" description={`${newCount} nouvelles idées. Lancer une idée la fait passer par l'accord, puis le résultat.`}>
        <RadioGroup options={modes} bind:value={mode} orientation="horizontal" aria-label="État de la page" />
    </Section>

    {#if mode === 'upsell'}
        <IdeasUpsell upgradeHref="/#/pricing" />
    {:else}
        <IdeasPage
            ideas={shown}
            bind:layout
            loading={mode === 'loading'}
            generating={mode === 'busy'}
            error={mode === 'error' ? 'Bulle ne répond pas. Réessayez dans un instant.' : null}
            {lastGeneratedAt}
            {busyIds}
            onGenerate={generate}
            onRetry={() => (mode = 'ready')}
            onRun={run}
            onDismiss={dismiss}
            onApprove={approve}
            onDecline={decline}
        />
    {/if}

    <Section title="IdeaCard" description="Un état de run par carte : repos, en cours, accord à donner, terminé, échec.">
        <ul class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {#each ideaFixtures() as idea (idea.id)}
                <li class="min-w-0"><IdeaCard {idea} level={3} onRun={() => {}} onDismiss={() => {}} /></li>
            {/each}
        </ul>
    </Section>

    <Section title="ApprovalCard" description="La même carte sert aux confirmations d'un run et aux confirmations MCP.">
        <div class="grid gap-4 md:grid-cols-2">
            <ApprovalCard
                approval={sampleApproval('demo')}
                busy={approvalBusy}
                onApprove={(a) => answerApproval('Approuvé', a)}
                onDecline={(a) => answerApproval('Refusé', a)}
            />
            <ApprovalCard approval={{ ...sampleApproval('busy'), args: undefined }} busy onApprove={() => {}} onDecline={() => {}} />
        </div>
        <p class="text-fc-sm text-fc-fg-muted" role="status">{approvalAnswer}</p>
    </Section>
</Page>

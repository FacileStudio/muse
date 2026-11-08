<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import type { ApprovalRequest } from '../../utils/ideas.js';

    export interface ApprovalCardProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
        /** The pending confirmation: tool label, human summary and the arguments it would use. */
        approval: ApprovalRequest;
        /** True while the answer is on its way. Both buttons stay disabled until it settles. */
        busy?: boolean;
        onApprove: (approval: ApprovalRequest) => void;
        onDecline: (approval: ApprovalRequest) => void;
        class?: string;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { getI18n } from '../../i18n/context.svelte.js';
    import { icons } from '../../icons.js';
    import { formatArgs } from '../../utils/ideas-view.js';
    import Badge from '../atoms/Badge.svelte';
    import Button from '../atoms/Button.svelte';
    import Icon from '../atoms/Icon.svelte';
    import Spinner from '../atoms/Spinner.svelte';
    import Collapsible from './Collapsible.svelte';

    let { approval, busy = false, onApprove, onDecline, class: className = '', ...rest }: ApprovalCardProps = $props();

    const i18n = getI18n();
    const args = $derived(formatArgs(approval.args));
</script>

<!--
@component
Une confirmation en attente : l'outil, un résumé lisible, les arguments à la demande, puis approuver ou refuser. Les runs d'idées et les confirmations MCP l'utilisent tous les deux.
-->

<section
    aria-label={`${i18n.t('ideas.approval.heading')}: ${approval.tool}`}
    aria-busy={busy}
    class={twMerge('flex flex-col gap-3 rounded-fc-md bg-fc-surface p-4', className)}
    {...rest}
>
    <div class="flex items-start gap-3">
        <Icon icon={icons.shield} size={20} class="mt-0.5 shrink-0 text-fc-warning" />
        <div class="flex min-w-0 flex-col gap-1.5">
            <p class="text-fc-xs font-medium text-fc-fg-muted">{i18n.t('ideas.approval.heading')}</p>
            <Badge tone="warning">{approval.tool}</Badge>
            <p class="text-fc-sm wrap-anywhere text-fc-fg">{approval.summary}</p>
        </div>
    </div>

    {#if args}
        <Collapsible title={i18n.t('ideas.approval.args')} level={4} region={false} class="-mx-3">
            <pre class="max-h-60 overflow-auto rounded-fc-md bg-fc-component p-3 text-fc-xs whitespace-pre-wrap wrap-anywhere text-fc-fg">{args}</pre>
        </Collapsible>
    {/if}

    <div class="flex flex-wrap items-center gap-2">
        <Button size="lg" icon={icons.check} disabled={busy} onclick={() => onApprove(approval)}>
            {i18n.t('ideas.approval.approve')}
        </Button>
        <Button size="lg" variant="secondary" icon={icons.close} disabled={busy} onclick={() => onDecline(approval)}>
            {i18n.t('ideas.approval.decline')}
        </Button>
        {#if busy}
            <Spinner size="sm" label={i18n.t('ideas.approval.busy')} />
        {/if}
    </div>
</section>

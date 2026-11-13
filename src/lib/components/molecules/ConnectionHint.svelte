<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import type { ConnectionHintLabels, ConnectionState } from '../../utils/connection.js';

    export type { ConnectionHintLabels, ConnectionState };

    export interface ConnectionHintProps extends HTMLAttributes<HTMLSpanElement> {
        /** The realtime link. `live` renders nothing. */
        state: ConnectionState;
        /** Overrides for the strings. `offlineDetail` is the tooltip behind the offline pill. */
        labels?: Partial<ConnectionHintLabels>;
        class?: string;
    }
</script>

<script lang="ts">
    import StatusDot from '../atoms/StatusDot.svelte';
    import Tooltip from '../atoms/Tooltip.svelte';
    import { getI18n } from '../../i18n/context.svelte.js';
    import { twMerge } from '../../utils/cn.js';
    import { connectionHintLabels, connectionLook } from '../../utils/connection.js';

    let { state, labels: overrides, class: className = '', ...rest }: ConnectionHintProps = $props();

    const i18n = getI18n();
    const labels = $derived(connectionHintLabels(i18n.t, overrides));
    const look = $derived(connectionLook(state));
    const detail = $derived(look?.detail ? labels[look.detail] : '');

    const classes = $derived(
        twMerge(
            'inline-flex h-7 max-w-full items-center rounded-fc-pill bg-fc-surface px-2.5',
            className
        )
    );
</script>

<!--
@component
L'état du lien temps réel d'un document, en une pastille discrète : rien quand tout va bien, puis reconnexion, hors ligne ou déconnecté.
-->

{#if look}
    <Tooltip text={detail} disabled={!detail}>
        <span role="status" class={classes} {...rest}>
            <StatusDot tone={look.tone} pulse={look.pulse} label={labels[look.label]} class="text-fc-xs" />
            {#if detail}<span class="sr-only">{detail}</span>{/if}
        </span>
    </Tooltip>
{/if}

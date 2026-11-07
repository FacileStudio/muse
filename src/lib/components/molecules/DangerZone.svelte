<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';

    export interface DangerZoneProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'title'> {
        title?: string;
        description?: string;
        /** The destructive actions: `variant="danger"` buttons, each behind a `ConfirmModal`. */
        children: Snippet;
        class?: string;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { getI18n } from '../../i18n/context.svelte.js';

    let { title, description, children, class: className = '', ...rest }: DangerZoneProps = $props();

    const i18n = getI18n();
    const headingId = $props.id();
</script>

<!--
@component
La zone dangereuse : un fond rouge teinté, sans bordure, tout en bas de la dernière section. Une action destructive coûte un défilement.
-->

<section
    aria-labelledby={headingId}
    class={twMerge('flex flex-col gap-4 rounded-fc-lg bg-fc-danger/10 p-5', className)}
    {...rest}
>
    <div class="flex flex-col gap-1">
        <h3 id={headingId} class="text-fc-md font-semibold text-fc-danger">{title ?? i18n.t('settings.danger.title')}</h3>
        <p class="text-fc-sm text-fc-fg-muted">{description ?? i18n.t('settings.danger.description')}</p>
    </div>
    <div class="flex flex-wrap items-center gap-3">
        {@render children()}
    </div>
</section>

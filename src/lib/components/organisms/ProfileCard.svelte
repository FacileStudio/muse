<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';

    export type Orientation = 'vertical' | 'horizontal';

    export type Meta = { label: string; value: string };

    export interface ProfileCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
        name: string;
        email?: string;
        avatar?: string;
        color?: string;
        role?: string;
        meta?: Meta[];
        actions?: Snippet;
        children?: Snippet;
        orientation?: Orientation;
        class?: string;

    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import Avatar from '../atoms/Avatar.svelte';
    import Badge from '../atoms/Badge.svelte';
    import Card from '../atoms/Card.svelte';
    import Divider from '../atoms/Divider.svelte';

    /* `role` is the member's role in the workspace, not an ARIA role — the DOM attribute of
       the same name is dropped from the passthrough so the two cannot collide into an
       intersection type no caller can satisfy. */

    let {
        name,
        email,
        avatar,
        color,
        role,
        meta = [],
        actions,
        children,
        orientation = 'horizontal',
        class: className = '',
        ...rest
    }: ProfileCardProps = $props();

    const vertical = $derived(orientation === 'vertical');
    const roleTone = $derived(role === 'owner' ? 'owner' : role === 'admin' ? 'admin' : 'neutral');

    const classes = $derived(twMerge('flex flex-col gap-4', className));
    const identityClasses = $derived(
        vertical
            ? 'flex flex-col items-center gap-3 text-center'
            : 'flex flex-col gap-4 sm:flex-row sm:items-center'
    );
    const textClasses = $derived(vertical ? 'flex w-full min-w-0 flex-col gap-1' : 'flex min-w-0 flex-1 flex-col gap-1');
    const headingClasses = $derived(
        vertical ? 'flex min-w-0 items-center justify-center gap-2' : 'flex min-w-0 items-center gap-2'
    );
    const actionsClasses = $derived(
        vertical
            ? 'flex min-h-11 w-full flex-wrap items-center justify-center gap-2'
            : 'flex min-h-11 flex-wrap items-center gap-2 sm:ml-auto sm:shrink-0'
    );
</script>

<Card class={classes} {...rest}>
    <div class={identityClasses}>
        <span class="relative inline-flex shrink-0">
            <Avatar src={avatar} alt={name} {name} size="lg" />
            {#if color}
                <span
                    class="absolute -right-0.5 -bottom-0.5 h-4 w-4 rounded-fc-pill border-2 border-fc-component"
                    style:background-color={color}
                    aria-hidden="true"
                ></span>
            {/if}
        </span>

        <div class={textClasses}>
            <div class={headingClasses}>
                <span class="truncate text-fc-lg font-semibold text-fc-fg">{name}</span>
                {#if role}
                    <Badge tone={roleTone} class="shrink-0">{role}</Badge>
                {/if}
            </div>
            {#if email}
                <span class="truncate text-fc-sm text-fc-fg-muted">{email}</span>
            {/if}
        </div>

        {#if actions}
            <div class={actionsClasses}>
                {@render actions()}
            </div>
        {/if}
    </div>

    {#if meta.length > 0}
        <Divider />
        <dl class="flex flex-col">
            {#each meta as row (row.label)}
                <div
                    class="flex items-baseline justify-between gap-3 border-t border-fc-border py-2 text-fc-sm first:border-t-0 first:pt-0"
                >
                    <dt class="shrink-0 text-fc-fg-muted">{row.label}</dt>
                    <dd class="min-w-0 truncate text-right text-fc-fg">{row.value}</dd>
                </div>
            {/each}
        </dl>
    {/if}

    {#if children}
        <Divider />
        {@render children()}
    {/if}
</Card>

<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';

    export interface ListItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
        title: string;
        description?: string;
        /** Makes the whole row a link. */
        href?: string;
        /** Makes the whole row a button, for selection rather than navigation. */
        onSelect?: () => void;
        active?: boolean;
        /** Drawn flush on the left when there is no `leading`, and blurred behind the row on hover and when active. */
        image?: string;
        /** A colour blurred behind the row on hover and when active, for rows with no image. */
        tint?: string;
        class?: string;
        /** Image on the left, drawn flush to the row's edges at its full height. Without one the row is padded instead. */
        leading?: Snippet;
        /** Secondary values between the title and the actions, hidden under `sm`. */
        meta?: Snippet;
        /** Row actions. On a pointer that hovers, they appear on hover and on focus. */
        actions?: Snippet;
    }
</script>

<script lang="ts">
    import { gsap } from 'gsap';
    import { twMerge } from '../../utils/cn.js';
    import { appear } from '../../utils/appear.js';
    import { prefersReducedMotion } from '../../utils/motion.js';

    let {
        title,
        description,
        href,
        onSelect,
        active = false,
        image,
        tint,
        class: className = '',
        leading,
        meta,
        actions,
        ...rest
    }: ListItemProps = $props();

    const classes = $derived(
        twMerge(
            'group relative isolate flex min-h-16 items-center gap-4 overflow-hidden rounded-fc pr-4',
            !leading && !image && 'py-3 pl-4',
            active ? 'bg-fc-surface-hover' : 'bg-fc-surface hover:bg-fc-surface-hover',
            className
        )
    );

    /* The link or button stretches over the row with `after:inset-0`, so the row is one target
       while the actions stay real buttons beside it, not nested inside an <a>. The ring is inset
       because the row clips its flush image. */
    const target =
        'text-left after:absolute after:inset-0 after:rounded-fc focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-fc-brand';

    let glow = $state<HTMLElement>();
    let engaged = $state(false);

    /* Selection is the image, never the brand: the blur fades in on hover, focus, and while active. */
    $effect(() => {
        if (!glow)
            return;

        const on = active || engaged;

        gsap.to(glow, {
            opacity: on ? 0.35 : 0,
            scale: on ? 1.3 : 1,
            duration: prefersReducedMotion() ? 0 : 0.6,
            ease: 'power3.inOut',
            overwrite: 'auto',
        });
    });

    const glowClass =
        'pointer-events-none absolute top-1/2 left-24 -z-10 w-full -translate-y-1/2 opacity-0 saturate-200 blur-3xl [mask-image:linear-gradient(90deg,black_0%,transparent_66%)]';
</script>

<!--
@component
Une ligne de liste posée sur sa propre surface : image à fleur de bord, titre, valeurs et actions. Les lignes se suivent à 4px, sans conteneur autour.
-->

{#snippet label()}
    <span class="flex min-w-0 items-baseline gap-2">
        <span class="truncate text-fc-lead text-fc-ink">{title}</span>
        {#if description}
            <span class="truncate text-fc-subtext text-fc-muted">{description}</span>
        {/if}
    </span>
{/snippet}

<div
    class={classes}
    use:appear
    onpointerenter={() => (engaged = true)}
    onpointerleave={() => (engaged = false)}
    onfocusin={() => (engaged = true)}
    onfocusout={() => (engaged = false)}
    {...rest}
>
    {#if image}
        <img bind:this={glow} src={image} alt="" aria-hidden="true" class={twMerge(glowClass, 'object-cover')} />
    {:else if tint}
        <span bind:this={glow} aria-hidden="true" class={twMerge(glowClass, 'h-[400%]')} style:background-color={tint}></span>
    {/if}

    {#if leading}
        <div class="flex shrink-0 self-stretch">{@render leading()}</div>
    {:else if image}
        <img src={image} alt="" class="h-16 aspect-[16/10] shrink-0 self-stretch object-cover" />
    {/if}

    <div class="min-w-0 flex-1">
        {#if href}
            <a {href} aria-current={active ? 'page' : undefined} class={twMerge('block', target)}>{@render label()}</a>
        {:else if onSelect}
            <button type="button" aria-pressed={active} onclick={onSelect} class={twMerge('block w-full', target)}>
                {@render label()}
            </button>
        {:else}
            {@render label()}
        {/if}
    </div>

    {#if meta}
        <div class="hidden shrink-0 items-center gap-8 text-fc-p tabular-nums text-fc-muted sm:flex">
            {@render meta()}
        </div>
    {/if}

    {#if actions}
        <div
            class="relative z-10 flex shrink-0 items-center gap-1 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:opacity-100"
        >
            {@render actions()}
        </div>
    {/if}
</div>

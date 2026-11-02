<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';

    export interface MediaCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
        image: string;
        /** Alt text for the image; empty when the title already names it. */
        alt?: string;
        title?: string;
        /** A short value on the title's line, such as a duration. */
        aside?: string;
        /** Makes the whole card a link. */
        href?: string;
        class?: string;
        /** Chips over the image's top-left corner, such as a date. */
        overlay?: Snippet;
        /** Buttons over the image's top-right corner. On a pointer that hovers, they appear on hover and on focus. */
        actions?: Snippet;
        /** The body under the title: values, buttons, a footer. */
        children?: Snippet;
    }
</script>

<script lang="ts">
    import { gsap } from 'gsap';
    import { twMerge } from '../../utils/cn.js';
    import { appear } from '../../utils/appear.js';
    import { prefersReducedMotion } from '../../utils/motion.js';

    let {
        image,
        alt = '',
        title,
        aside,
        href,
        class: className = '',
        overlay,
        actions,
        children,
        ...rest
    }: MediaCardProps = $props();

    let media = $state<HTMLImageElement>();
    let glow = $state<HTMLImageElement>();
    let engaged = $state(false);

    /* The same image, blurred behind the body, is the card's only highlight: no brand fill. */
    $effect(() => {
        if (!media || !glow)
            return;

        const duration = prefersReducedMotion() ? 0 : 0.6;
        const vars = { duration, ease: 'power3.inOut', overwrite: 'auto' as const };

        gsap.to(media, {
            ...vars,
            scale: engaged ? 1.05 : 1,
        });
        gsap.to(glow, {
            ...vars,
            opacity: engaged ? 0.5 : 0.35,
            scale: engaged ? 1.25 : 1,
        });
    });

    const classes = $derived(
        twMerge('group relative isolate flex flex-col overflow-hidden rounded-fc bg-fc-surface hover:bg-fc-surface-hover', className)
    );

    const chip = 'flex items-center gap-1 rounded-fc bg-black/60 text-fc-subtext text-white/80 backdrop-blur-md';
</script>

<!--
@component
Une carte à image : la photo en haut, des pastilles posées dessus, et le corps éclairé par la même image floutée. Toute la carte peut être un lien.
-->

<div
    class={classes}
    use:appear
    onpointerenter={() => (engaged = true)}
    onpointerleave={() => (engaged = false)}
    onfocusin={() => (engaged = true)}
    onfocusout={() => (engaged = false)}
    {...rest}
>
    {#if href}
        <!-- stretched over the card so the buttons inside stay buttons, not nested in an <a> -->
        <a
            {href}
            aria-label={title ?? alt}
            class="absolute inset-0 z-0 rounded-fc focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-fc-brand"
        ></a>
    {/if}

    <div class="pointer-events-none relative aspect-[16/10] overflow-hidden bg-fc-surface-hover">
        <img bind:this={media} src={image} {alt} class="h-full w-full object-cover" />

        {#if overlay}
            <div class={twMerge(chip, 'absolute top-3 left-3 px-2 py-1')}>{@render overlay()}</div>
        {/if}
    </div>

    {#if actions}
        <div
            class="absolute top-3 right-3 z-10 flex gap-1 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:opacity-100"
        >
            {@render actions()}
        </div>
    {/if}

    {#if title || children}
        <div class="pointer-events-none relative isolate flex flex-1 flex-col gap-4 overflow-hidden p-5">
            <img
                bind:this={glow}
                src={image}
                alt=""
                aria-hidden="true"
                class="absolute -top-24 left-0 -z-10 h-full w-full object-cover opacity-35 saturate-150 blur-[100px]"
            />

            {#if title}
                <div class="flex items-baseline justify-between gap-2">
                    <p class="truncate text-fc-subtitle text-fc-ink">{title}</p>
                    {#if aside}<span class="shrink-0 text-fc-subtext text-fc-faint">{aside}</span>{/if}
                </div>
            {/if}

            {#if children}
                <div class="pointer-events-auto relative z-10 mt-auto flex flex-col gap-1">{@render children()}</div>
            {/if}
        </div>
    {/if}
</div>

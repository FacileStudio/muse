<script lang="ts" generics="Slide extends { id: string | number }">
    import type { Snippet } from 'svelte';
    import { twMerge } from '../../utils/cn.js';
    import { icons } from '../../icons.js';
    import { prefersReducedMotion } from '../../utils/motion.js';

    const control =
        'inline-flex size-11 shrink-0 items-center justify-center rounded-fc-pill text-fc-fg-muted transition-colors hover:bg-fc-surface hover:text-fc-fg disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring';

    let {
        slides,
        children,
        ariaLabel = 'Carousel',
        class: className = ''
    }: {
        slides: Slide[];
        children: Snippet<[Slide, number]>;
        ariaLabel?: string;
        class?: string;
    } = $props();

    let track: HTMLDivElement | null = $state(null);
    let active = $state(0);

    const classes = $derived(twMerge('relative w-full', className));

    /* Guards against a shrinking `slides` prop stranding `active` past the last dot. */
    const index = $derived(Math.min(active, Math.max(0, slides.length - 1)));

    /*
        Re-observes on every change to `slides`: the observer only ever sees the slides
        that existed when it was built, so appending to the prop used to leave the dots
        pointing at a stale index forever.
    */
    $effect(() => {
        const node = track;
        const count = slides.length;
        if (!node || count === 0) return;

        const obs = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (!e.isIntersecting) continue;
                    const idx = Number((e.target as HTMLElement).dataset.idx);
                    if (Number.isInteger(idx)) active = idx;
                }
            },
            { root: node, threshold: 0.6 }
        );
        node.querySelectorAll<HTMLElement>('[data-slide]').forEach((el) => obs.observe(el));
        return () => obs.disconnect();
    });

    /*
        `active` is set here rather than left to the observer: with smooth scrolling off
        the observer fires late enough that the arrows read as unresponsive, and it never
        fires at all if the target is already partly in view.
    */
    function go(delta: number) {
        if (!track) return;
        const next = Math.min(slides.length - 1, Math.max(0, index + delta));
        const target = track.querySelector<HTMLElement>(`[data-idx="${next}"]`);
        if (!target) return;
        active = next;
        target.scrollIntoView({
            behavior: prefersReducedMotion() ? 'auto' : 'smooth',
            inline: 'start',
            block: 'nearest'
        });
    }
</script>

<section class={classes} aria-label={ariaLabel}>
    <!--
        A scroll container must be focusable or a keyboard user cannot scroll it — Safari
        never does this on its own. The lint rule only accepts interactive roles, and a
        scrollable group is not one, so it is wrong for this specific case.
    -->
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <div
        bind:this={track}
        role="group"
        aria-label="Slides"
        tabindex="0"
        class="flex overflow-x-auto snap-x snap-mandatory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring"
    >
        {#each slides as slide, i (slide.id)}
            <div class="flex-[0_0_100%] min-w-0 snap-start" data-slide data-idx={i}>
                {@render children(slide, i)}
            </div>
        {/each}
    </div>

    <!--
        Controls sit in their own row under the track, not floated over it. Arrows pinned
        inside the slide area overlap whatever the slide is showing — and a slide is usually
        text — so they were sitting on top of the copy at every width. They were also
        `hidden md:inline-flex`, which left a phone with no affordance at all beyond guessing
        that the area swipes.

        The row collapses entirely for a single slide: one dot and two dead arrows is chrome
        advertising that there is nothing to do.
    -->
    {#if slides.length > 1}
        <div class="flex items-center justify-center gap-2 pt-3">
            <button
                type="button"
                aria-label="Previous"
                onclick={() => go(-1)}
                disabled={index === 0}
                class={control}
            >
                <iconify-icon
                    icon={icons.chevronLeft}
                    width="18"
                    height="18"
                    class="block"
                ></iconify-icon>
            </button>

            <div class="flex items-center gap-1.5" aria-hidden="true">
                {#each slides as slide, i (slide.id)}
                    <span
                        class="size-1.5 rounded-fc-pill transition-colors {i === index
                            ? 'bg-fc-accent'
                            : 'bg-fc-fg-muted/40'}"
                    ></span>
                {/each}
            </div>

            <button
                type="button"
                aria-label="Next"
                onclick={() => go(1)}
                disabled={index === slides.length - 1}
                class={control}
            >
                <iconify-icon icon={icons.arrow} width="18" height="18" class="block"></iconify-icon>
            </button>
        </div>
    {/if}
</section>

<script lang="ts">
    import { onMount } from 'svelte';

    type Slide = { id: string | number };

    let {
        slides,
        children,
        ariaLabel = 'Carousel'
    }: {
        slides: Slide[];
        children: (slide: Slide, index: number) => unknown;
        ariaLabel?: string;
    } = $props();

    let track: HTMLDivElement | null = $state(null);
    let active = $state(0);

    onMount(() => {
        if (!track) return;
        const obs = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (e.isIntersecting) {
                        active = Number((e.target as HTMLElement).dataset.idx);
                    }
                }
            },
            { root: track, threshold: 0.6 }
        );
        track.querySelectorAll<HTMLElement>('[data-slide]').forEach((el) => obs.observe(el));
        return () => obs.disconnect();
    });

    function go(delta: number) {
        if (!track) return;
        const next = Math.min(slides.length - 1, Math.max(0, active + delta));
        const target = track.querySelector<HTMLElement>(`[data-idx="${next}"]`);
        target?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    }
</script>

<section class="relative w-full" aria-label={ariaLabel}>
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

    <button
        type="button"
        aria-label="Previous"
        onclick={() => go(-1)}
        disabled={active === 0}
        class="hidden md:inline-flex items-center justify-center absolute top-1/2 left-2 -translate-y-1/2 w-11 h-11 rounded-fc-pill border border-fc-border bg-fc-surface text-fc-fg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
    >‹</button>
    <button
        type="button"
        aria-label="Next"
        onclick={() => go(1)}
        disabled={active === slides.length - 1}
        class="hidden md:inline-flex items-center justify-center absolute top-1/2 right-2 -translate-y-1/2 w-11 h-11 rounded-fc-pill border border-fc-border bg-fc-surface text-fc-fg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
    >›</button>

    <div class="flex justify-center gap-1.5 py-3" aria-hidden="true">
        {#each slides as slide, i (slide.id)}
            <span class="w-1.5 h-1.5 rounded-fc-pill {i === active ? 'bg-fc-accent' : 'bg-fc-surface'}"></span>
        {/each}
    </div>
</section>

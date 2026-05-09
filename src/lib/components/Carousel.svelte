<script lang="ts">
  import { onMount } from 'svelte';

  /**
   * Touch + keyboard carousel. Mobile-first: full-width slides, snap scrolling.
   * Desktop: arrow buttons appear. Provide slides via the `slides` snippet prop.
   */
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
  <div
    bind:this={track}
    tabindex="0"
    class="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
    class="hidden md:inline-flex items-center justify-center absolute top-1/2 left-2 -translate-y-1/2 w-11 h-11 rounded-fc-pill   bg-fc-surface text-fc-fg text-2xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
  >‹</button>
  <button
    type="button"
    aria-label="Next"
    onclick={() => go(1)}
    disabled={active === slides.length - 1}
    class="hidden md:inline-flex items-center justify-center absolute top-1/2 right-2 -translate-y-1/2 w-11 h-11 rounded-fc-pill   bg-fc-surface text-fc-fg text-2xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
  >›</button>

  <div class="flex justify-center gap-1.5 py-3" role="tablist">
    {#each slides as _, i}
      <span
        aria-hidden="true"
        class="w-1.5 h-1.5 rounded-full {i === active ? 'bg-fc-accent' : 'bg-fc-'}"
      ></span>
    {/each}
  </div>
</section>

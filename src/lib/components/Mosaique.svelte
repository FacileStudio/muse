<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { prefersReducedMotion, isMobile } from '../utils/motion.js';

  /**
   * Scattered card mosaic — cards bloom out from center to non-overlapping random positions.
   * Mobile: smaller spread, tighter min distance. Reduced-motion: cards land instantly in a grid.
   */
  type Item = { id: string | number };

  let {
    items,
    children,
    minDistance,
    paddingX,
    paddingY,
    isLoading = false,
    loadError = ''
  }: {
    items: Item[];
    children: (item: Item, index: number, ref: (el: HTMLButtonElement) => void) => unknown;
    minDistance?: number;
    paddingX?: number;
    paddingY?: number;
    isLoading?: boolean;
    loadError?: string;
  } = $props();

  let cards: HTMLButtonElement[] = $state([]);

  onMount(() => {
    if (!cards.length) return;
    const container = cards[0].parentElement;
    if (!container) return;

    const mobile = isMobile();
    const px = paddingX ?? (mobile ? 20 : 80);
    const py = paddingY ?? (mobile ? 60 : 140);
    const minD = minDistance ?? (mobile ? 110 : 200);
    const MAX_ATTEMPTS = 50;

    const targets: { x: number; y: number }[] = [];

    gsap.set(cards, {
      position: 'absolute',
      top: '50%',
      left: '50%',
      xPercent: -50,
      yPercent: -50,
      x: 0,
      y: 0,
      scale: prefersReducedMotion() ? 1 : 0.2
    });

    cards.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const w = rect.width || 200;
      const h = rect.height || 280;
      const maxX = container.clientWidth / 2 - w / 2 - px;
      const maxY = container.clientHeight / 2 - h / 2 - py;
      let bestX = 0;
      let bestY = 0;
      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        const tx = Math.random() * (maxX * 2) - maxX;
        const ty = Math.random() * (maxY * 2) - maxY;
        const overlap = targets.some(
          (p) => Math.hypot(p.x - tx, p.y - ty) < minD
        );
        if (!overlap) {
          bestX = tx;
          bestY = ty;
          break;
        }
      }
      targets.push({ x: bestX, y: bestY });
    });

    if (prefersReducedMotion()) {
      gsap.set(cards, { x: (i) => targets[i].x, y: (i) => targets[i].y, scale: 1 });
      return;
    }
    gsap.to(cards, {
      scale: 1,
      x: (i) => targets[i].x,
      y: (i) => targets[i].y,
      duration: 1,
      stagger: { each: 0.06, from: 'random' }
    });
  });
</script>

<div class="relative w-full h-full overflow-hidden z-[5]">
  {#if isLoading}
    <div class="flex min-h-64 w-full items-center justify-center text-fc-fg-muted">
      <iconify-icon icon="line-md:loading-twotone-loop" width="42"></iconify-icon>
    </div>
  {:else if loadError}
    <div class="flex min-h-64 w-full flex-col items-center justify-center p-6 text-center text-fc-fg-muted bg-white/[0.03]">
      <p>{loadError}</p>
    </div>
  {:else if !items || items.length === 0}
    <div class="flex min-h-64 w-full items-center justify-center text-fc-fg-muted"></div>
  {:else}
    <div class="relative w-screen h-dvh">
      {#each items as item, index (item.id)}
        {@render children(item, index, (el) => (cards[index] = el))}
      {/each}
    </div>
  {/if}
</div>

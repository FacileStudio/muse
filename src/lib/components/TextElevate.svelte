<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { prefersReducedMotion } from '../utils/motion.js';

  /**
   * Text that rises into view on mount.
   * Splits into provided lines or uses single block. Mobile-friendly clamp via parent.
   */
  let {
    text,
    delay = 0.2,
    stagger = 0.1,
    duration = 1
  }: { text: string; delay?: number; stagger?: number; duration?: number } = $props();

  let inner: HTMLDivElement | null = $state(null);

  onMount(() => {
    if (!inner) return;
    if (prefersReducedMotion()) {
      gsap.set(inner, { y: 0, opacity: 1 });
      return;
    }
    gsap.fromTo(
      inner,
      { y: '100%', opacity: 0 },
      { y: 0, opacity: 1, duration, stagger, delay, ease: 'power3.out' }
    );
  });
</script>

<div class="relative inline-block overflow-hidden leading-[1.1]">
  <div bind:this={inner} class="will-change-[transform,opacity]">{text}</div>
</div>

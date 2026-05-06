<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { prefersReducedMotion } from '../utils/motion.js';

  /**
   * Page-transition curtain. Mount = curtain raises. Call `close(href)` to drop curtain then navigate.
   * Mobile-proof: uses 100dvh, no fixed pixels, motion-reduce safe.
   */
  let {
    duration = 1.5,
    color = 'var(--color-fc-bg)'
  }: { duration?: number; color?: string } = $props();

  let rideau: HTMLDivElement | null = $state(null);

  onMount(() => {
    if (!rideau) return;
    if (prefersReducedMotion()) {
      rideau.style.height = '0';
      return;
    }
    gsap.to(rideau, { height: 0, duration, ease: 'power3.inOut' });
  });

  export function close(href: string) {
    if (!rideau) return;
    if (prefersReducedMotion()) {
      window.location.href = href;
      return;
    }
    gsap.to(rideau, {
      height: '100dvh',
      duration,
      ease: 'power3.inOut',
      onComplete: () => (window.location.href = href)
    });
  }
</script>

<div
  bind:this={rideau}
  class="fixed inset-x-0 top-0 w-screen h-dvh z-[9999] pointer-events-none"
  style:background={color}
  aria-hidden="true"
></div>

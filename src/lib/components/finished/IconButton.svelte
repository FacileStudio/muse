<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { gsap } from 'gsap';
  import { twMerge } from 'tailwind-merge';
  import { prefersReducedMotion } from '../../utils/motion.js';

  let {
    class: className = '',
    children,
    ...rest
  }: HTMLButtonAttributes & {
    class?: string;
    children: Snippet;
  } = $props();

  const classes = $derived(twMerge(
    'inline-flex w-10 h-10 items-center justify-center gap-[6px] rounded-fc-full border border-fc-fg/7 text-fc-fg [&_svg]:w-3 [&_svg]:h-3 transition-opacity hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-fc-accent',
    className
  ));

  function press(e: PointerEvent) {
    if (prefersReducedMotion()) return;
    const el = e.currentTarget as HTMLElement;
    gsap.killTweensOf(el, 'scale');
    gsap.to(el, {
      scale: 0.88,
      duration: 0.08,
      ease: 'power2.in',
      onComplete: () => gsap.to(el, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
    });
  }
</script>

<button class={classes} onpointerdown={press} {...rest}>
  {@render children()}
</button>

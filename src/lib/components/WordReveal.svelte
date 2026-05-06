<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { SplitText } from 'gsap/SplitText';
  import { prefersReducedMotion } from '../utils/motion.js';

  /**
   * Word-by-word color reveal driven by scroll position.
   * Mobile: shorter scrub end so users on small screens see full reveal.
   */
  let {
    text,
    dimColor = '#ffffff15',
    revealColor = 'var(--color-fc-fg)'
  }: { text: string; dimColor?: string; revealColor?: string } = $props();

  let el: HTMLParagraphElement | null = $state(null);

  onMount(() => {
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.color = revealColor;
      return;
    }
    gsap.registerPlugin(ScrollTrigger, SplitText);
    const split = SplitText.create(el, { type: 'words' });
    gsap.to(split.words, {
      color: revealColor,
      stagger: 0.1,
      scrollTrigger: {
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        scrub: true
      }
    });
  });
</script>

<p
  bind:this={el}
  class="leading-loose text-fc-lg max-w-[60ch]"
  style:color={dimColor}
>{text}</p>

<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  let {
    class: className = '',
    children,
    ...rest
  }: HTMLButtonAttributes & {
    class?: string;
    children: Snippet;
  } = $props();
</script>

<button
  class="inline-flex w-10 h-10 items-center justify-center gap-[6px] rounded-fc-full border border-[rgba(36,36,36,0.07)] text-[rgba(36,36,36,0.5)] [&_svg]:w-3 [&_svg]:h-3 transition-opacity hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-fc-accent {className}"
  {...rest}
>
  {@render children()}
</button>

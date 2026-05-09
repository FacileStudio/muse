<script lang="ts">
  import { twMerge } from 'tailwind-merge';

  /** Thin horizontal separator. */
  let { class: className = '' }: { class?: string } = $props();

  const classes = $derived(twMerge('-0 -t  my-4', className));
</script>

<hr class={classes} />

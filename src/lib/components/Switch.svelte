<script lang="ts">
  import { twMerge } from 'tailwind-merge';

  /** Toggle switch backed by a checkbox. */
  let {
    label,
    checked = $bindable(false),
    disabled = false,
    class: className = ''
  }: {
    label?: string;
    checked?: boolean;
    disabled?: boolean;
    class?: string;
  } = $props();

  const classes = $derived(twMerge('inline-flex items-center gap-3 cursor-pointer text-fc-md text-fc-fg', disabled ? 'opacity-50 cursor-not-allowed' : '', className));
</script>

<label class={classes}>
  <input type="checkbox" bind:checked {disabled} class="peer sr-only" />
  <span
    class="relative h-6 w-11 rounded-fc-pill bg-fc- transition-colors peer-checked:bg-fc-accent peer-checked:[&>span]:translate-x-5"
  >
    <span class="absolute top-0.5 left-0.5 h-5 w-5 rounded-fc-pill bg-white transition-transform"></span>
  </span>
  {#if label}<span>{label}</span>{/if}
</label>

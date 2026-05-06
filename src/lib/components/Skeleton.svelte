<script lang="ts">
  /** Placeholder block while content loads. Size via classes (e.g. `h-4 w-32`). */
  let { class: className = '' }: { class?: string } = $props();
</script>

<div class="animate-pulse motion-reduce:animate-none rounded-fc-sm bg-fc-border/60 {className}"></div>

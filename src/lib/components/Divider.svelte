<script lang="ts">
  /** Thin horizontal separator. */
  let { class: className = '' }: { class?: string } = $props();
</script>

<hr class="border-0 border-t border-fc-border my-4 {className}" />

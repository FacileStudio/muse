<script lang="ts">
    import { LOCALES } from '@facile/muse';
    import Localised from '$lib/demos/Localised.svelte';
</script>

<div class="flex flex-col items-start gap-3">
    {#each LOCALES as locale (locale)}
        <Localised {locale} />
    {/each}
</div>

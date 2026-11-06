<script lang="ts">
    import { Pagination } from '@facile/muse';

    let page = $state(7);
</script>

<Pagination bind:page pageCount={24} />

<script lang="ts">
    import { Inline, Popover } from '@facile/muse';
</script>

<Inline gap="content">
    {#each ['top', 'right', 'bottom', 'left'] as const as side (side)}
        <Popover label={side} {side} align="center">
            <p class="text-fc-sm text-fc-fg-muted">S'ouvre à {side}, et bascule de l'autre côté quand la place manque.</p>
        </Popover>
    {/each}
</Inline>

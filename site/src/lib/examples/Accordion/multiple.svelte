<script lang="ts">
    import { Accordion } from '@facile/muse';

    const items = [
        { id: 'a', title: 'Facturation' },
        { id: 'b', title: 'Sécurité' },
        { id: 'c', title: 'Archivée', disabled: true }
    ];
</script>

<Accordion {items} multiple level={4}>
    {#snippet panel(item)}
        <p>Réglages de {item.title.toLowerCase()}.</p>
    {/snippet}
</Accordion>

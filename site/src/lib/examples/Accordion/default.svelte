<script lang="ts">
    import { Accordion } from '@facile/muse';

    let open = $state(['a']);
    const items = [
        { id: 'a', title: 'Qu’est-ce qu’un espace ?' },
        { id: 'b', title: 'Comment inviter quelqu’un ?' },
        { id: 'c', title: 'Puis-je changer de formule ?' }
    ];
</script>

<Accordion {items} bind:open>
    {#snippet panel(item)}
        <p>Réponse à « {item.title} ».</p>
    {/snippet}
</Accordion>

<script lang="ts">
    import { Button, Modal, Table } from '@facile/muse';

    let open = $state(false);

    const lines = [
        { day: 'Lundi', task: 'Intégration du tunnel de paiement', hours: '6 h 30' },
        { day: 'Mardi', task: 'Revue de code API Casier', hours: '3 h 00' },
        { day: 'Mercredi', task: 'Atelier cadrage Heranova', hours: '4 h 15' }
    ];
</script>

<Button variant="outline" onclick={() => (open = true)}>Détail de la semaine</Button>

<Modal bind:open title="Semaine 32 — 13 h 45 facturables" size="lg" showClose>
    <Table>
        <thead>
            <tr><th>Jour</th><th>Tâche</th><th>Durée</th></tr>
        </thead>
        <tbody>
            {#each lines as line (line.day)}
                <tr><td>{line.day}</td><td>{line.task}</td><td class="tabular-nums">{line.hours}</td></tr>
            {/each}
        </tbody>
    </Table>
</Modal>

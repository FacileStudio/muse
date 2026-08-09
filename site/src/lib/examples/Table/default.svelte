<script lang="ts">
    import { Table } from '@facile/muse';

    const rows = [
        { project: 'Refonte Sablier', client: 'Interne', hours: '128 h', budget: '160 h' },
        { project: 'Boutique Heranova', client: 'Heranova', hours: '76 h 30', budget: '90 h' },
        { project: 'Site vitrine LPB', client: 'LPB', hours: '41 h', budget: '40 h' },
        { project: 'Migration Nuage', client: 'Interne', hours: '18 h 15', budget: '60 h' }
    ];
</script>

<Table>
    <thead>
        <tr><th>Projet</th><th>Client</th><th>Pointé</th><th>Budget</th></tr>
    </thead>
    <tbody>
        {#each rows as row (row.project)}
            <tr>
                <td class="font-medium">{row.project}</td>
                <td>{row.client}</td>
                <td class="tabular-nums">{row.hours}</td>
                <td class="tabular-nums">{row.budget}</td>
            </tr>
        {/each}
    </tbody>
</Table>

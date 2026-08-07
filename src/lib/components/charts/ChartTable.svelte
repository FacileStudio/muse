<script lang="ts">
    import type { ChartRow } from '../../utils/chart.js';

    let {
        caption,
        head,
        columns,
        rows
    }: {
        caption: string;
        head: string;
        columns: string[];
        rows: ChartRow[];
    } = $props();
</script>

<!--
    `sr-only` goes on the wrapper, never on the <table> itself: `overflow: hidden` is
    ignored on a table box, so a table carrying the class is clipped visually while its
    wide `nowrap` content still contributes document-level overflow — which hands the
    whole page a horizontal scrollbar.
-->
<div class="sr-only">
    <table>
        <caption>{caption}</caption>
        <thead>
            <tr>
                <th scope="col">{head}</th>
                {#each columns as column, i (i)}
                    <th scope="col">{column}</th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each rows as row, i (i)}
                <tr>
                    <th scope="row">{row.label}</th>
                    {#each row.cells as cell, j (j)}
                        <td>{cell}</td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>

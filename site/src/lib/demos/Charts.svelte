<script lang="ts">
    import { BarChart, DonutChart, LineChart, Sparkline } from '@facile/muse';
    import Row from './Row.svelte';

    const labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'];
    const series = [
        { name: 'Facturé', data: [6, 8, 5, 9, 7] },
        { name: 'Interne', data: [2, 3, 4, 2, 3] }
    ];
</script>

<Row name="LineChart" lead="SVG sans dépendance. Ne passez pas vos propres couleurs : la palette est validée pour le contraste.">
    <div class="w-full"><LineChart {series} {labels} height={180} /></div>
</Row>

<Row name="BarChart" lead="Empilable. Chaque coin qui fait face à une gouttière est arrondi ; la ligne de base reste carrée.">
    <div class="w-full"><BarChart {series} {labels} height={180} stacked /></div>
</Row>

<Row name="DonutChart" lead="Jamais arrondi au stroke-linecap : ça pousse chaque part d'une demi-épaisseur au-delà de son angle.">
    <div class="w-full max-w-xs">
        <DonutChart
            data={[
                { label: 'Design', value: 42 },
                { label: 'Développement', value: 96 },
                { label: 'Réunions', value: 18 }
            ]}
        />
    </div>
</Row>

<Row name="Sparkline" lead="Une tendance dans une ligne de tableau, sans axes ni légende.">
    <Sparkline data={[3, 5, 4, 8, 6, 9, 7]} class="w-32" />
    <Sparkline data={[9, 7, 8, 4, 5, 3, 2]} class="w-32" />
</Row>

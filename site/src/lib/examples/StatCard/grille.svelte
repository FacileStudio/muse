<script lang="ts">
    import { StatCard } from '@facile/muse';
</script>

<div class="grid gap-4 sm:grid-cols-3">
    <StatCard label="Projets actifs" value={7} delta="2 livrés ce mois-ci" />
    <StatCard label="Heures facturables" value="128 h" delta="82 % du temps suivi" />
    <StatCard label="Factures en attente" value="3 240 €" delta="Dont 1 en retard" />
</div>

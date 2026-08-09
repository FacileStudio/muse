<script lang="ts">
    import { Sparkline, StatCard } from '@facile/muse';
</script>

<StatCard label="Heures suivies" value="6 h 20" delta="Sur les quatorze derniers jours">
    <Sparkline data={[3, 4.5, 2, 6, 5.5, 7, 4, 6.5, 8, 5, 6, 7.5, 6, 6.3]} />
</StatCard>

<script lang="ts">
    import { Section, StatCard } from '@facile/muse';
</script>

<Section title="Activité" description="Sur les trente derniers jours.">
    <div class="grid gap-4 sm:grid-cols-2">
        <StatCard label="Entrées de temps" value={214} delta="+18 %" />
        <StatCard label="Commentaires" value={57} delta="Stable" />
    </div>
</Section>

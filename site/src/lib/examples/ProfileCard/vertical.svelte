<script lang="ts">
    import { ProfileCard } from '@facile/muse';
</script>

<div class="w-full max-w-xs">
    <ProfileCard
        orientation="vertical"
        name="Léa Fontaine"
        email="lea.fontaine@facile.studio"
        role="member"
        color="#7C6CF0"
        meta={[
            { label: 'Heures cette semaine', value: '21 h 30' },
            { label: 'Espace principal', value: 'Studio' }
        ]}
    />
</div>

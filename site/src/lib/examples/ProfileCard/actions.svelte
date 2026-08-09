<script lang="ts">
    import { Button, ProfileCard, icons, toast } from '@facile/muse';
</script>

<div class="w-full max-w-md">
    <ProfileCard
        name="Yanis Berthier"
        email="yanis@heranova.fr"
        role="admin"
        meta={[
            { label: 'Projets', value: '3' },
            { label: 'Dernière activité', value: "il y a 12 min" }
        ]}
    >
        {#snippet actions()}
            <Button variant="outline" size="sm" icon={icons.mail} onclick={() => toast.info('Invitation renvoyée à yanis@heranova.fr.')}>
                Renvoyer l'invitation
            </Button>
            <Button variant="ghost-danger" size="sm" icon={icons.remove} onclick={() => toast.warning('Retrait du membre à confirmer.')}>
                Retirer
            </Button>
        {/snippet}
    </ProfileCard>
</div>

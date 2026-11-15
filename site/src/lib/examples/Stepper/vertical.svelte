<script lang="ts">
    import { Stepper } from '@facile/muse';
</script>

<Stepper
    orientation="vertical"
    current={1}
    steps={[
        { label: 'Boîte mail', description: 'Gmail, OVH ou votre domaine' },
        { label: 'Notifications', description: 'Prévenez-moi des nouveaux messages' },
        { label: 'Terminé' }
    ]}
/>

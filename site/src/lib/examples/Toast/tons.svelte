<script lang="ts">
    import { icons, Stack, Toast } from '@facile/muse';
</script>

<Stack gap="tight" class="max-w-sm">
    <Toast tone="neutral">Minuteur mis en pause.</Toast>
    <Toast tone="info" icon={icons.bolt}>Antenne Pool reconnecté après 3 tentatives.</Toast>
    <Toast tone="success" title="Facture payée">1 240 € reçus de GF Conseil.</Toast>
    <Toast tone="warning" title="Quota bientôt atteint">92 % du stockage de l'espace est utilisé.</Toast>
    <Toast tone="danger" title="Import interrompu">Le serveur SMTP a refusé la connexion.</Toast>
</Stack>

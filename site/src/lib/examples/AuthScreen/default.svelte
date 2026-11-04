<script lang="ts">
    import { Alert, AuthScreen, Icon, icons } from '@facile/muse';
</script>

<AuthScreen appName="Sablier" href="/auth/oidc" class="min-h-0 rounded-fc-lg">
    {#snippet logo()}
        <Icon icon={icons.clock} size={40} class="text-fc-fg" />
    {/snippet}
    {#snippet tagline()}Le temps passé, sans tableur.{/snippet}
    {#snippet notice()}
        <Alert tone="warning">Votre session a expiré. Reconnectez-vous pour continuer.</Alert>
    {/snippet}
</AuthScreen>

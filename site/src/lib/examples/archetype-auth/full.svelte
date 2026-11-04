<script lang="ts">
    import { Alert, AuthScreen, Icon, icons } from '@facile/muse';

    const erreur = 'Votre session a expiré. Reconnectez-vous pour continuer.';
</script>

<AuthScreen appName="Sablier" href="/auth/oidc" class="min-h-0 rounded-fc-lg">
    {#snippet logo()}
        <Icon icon={icons.clock} size={40} class="text-fc-fg" />
    {/snippet}
    {#snippet tagline()}Un seul login, zéro dépendance cloud.{/snippet}
    {#snippet notice()}
        {#if erreur}<Alert tone="warning">{erreur}</Alert>{/if}
    {/snippet}
</AuthScreen>

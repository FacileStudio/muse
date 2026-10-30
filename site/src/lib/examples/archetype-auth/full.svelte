<script lang="ts">
    import { Alert, Button, Card, Divider, Field, Icon, Input, Page, Stack, icons } from '@facile/muse';

    let email = $state('');
    let motDePasse = $state('');

    const erreur = 'Votre session a expiré. Reconnectez-vous pour continuer.';
</script>

<Page width="sm" class="items-center justify-center py-16">
    <Stack class="w-full max-w-[360px]">
        <Stack class="items-center text-center">
            <Icon icon={icons.clock} size={32} class="text-fc-brand" />
            <h1 class="text-fc-subtitle font-semibold text-fc-ink">Se connecter à Sablier</h1>
            <p class="text-fc-p text-fc-muted">Un seul login, zéro dépendance cloud.</p>
        </Stack>

        {#if erreur}
            <Alert tone="warning">{erreur}</Alert>
        {/if}

        <Card class="flex flex-col gap-1">
            <Button size="lg" class="w-full" icon={icons.shield} href="/auth/oidc" rel="external">
                Continuer avec Porte
            </Button>

            <div class="flex items-center gap-1">
                <Divider class="flex-1" />
                <span class="text-fc-subtext text-fc-muted">ou</span>
                <Divider class="flex-1" />
            </div>

            <Field label="Adresse e-mail">
                <Input bind:value={email} type="email" autocomplete="email" placeholder="vous@facile.studio" />
            </Field>

            <Field label="Mot de passe">
                <Input bind:value={motDePasse} type="password" autocomplete="current-password" />
            </Field>

            <Button type="submit" variant="outline" size="lg" class="w-full">Se connecter</Button>
        </Card>

        <p class="text-center text-fc-subtext text-fc-muted">
            Besoin d'un accès ? Demandez-le à l'administrateur de votre espace.
        </p>
    </Stack>
</Page>

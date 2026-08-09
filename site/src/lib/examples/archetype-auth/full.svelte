<script lang="ts">
    import { Alert, Button, Card, Divider, Field, Icon, Input, Page, Stack, icons } from '@facile/muse';

    let email = $state('');
    let motDePasse = $state('');

    const erreur = 'Votre session a expiré. Reconnectez-vous pour continuer.';
</script>

<Page width="sm" class="items-center justify-center py-16">
    <Stack gap="content" class="w-full max-w-[360px]">
        <Stack gap="bound" class="items-center text-center">
            <Icon icon={icons.clock} size={32} class="text-fc-accent" />
            <h1 class="text-fc-xl font-semibold text-fc-fg">Se connecter à Sablier</h1>
            <p class="text-fc-sm text-fc-fg-muted">Un seul login, zéro dépendance cloud.</p>
        </Stack>

        {#if erreur}
            <Alert tone="warning">{erreur}</Alert>
        {/if}

        <Card class="flex flex-col gap-4">
            <Button size="lg" class="w-full" icon={icons.shield} href="/auth/oidc">
                Continuer avec Porte
            </Button>

            <div class="flex items-center gap-2">
                <Divider class="flex-1" />
                <span class="text-fc-xs text-fc-fg-muted">ou</span>
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

        <p class="text-center text-fc-xs text-fc-fg-muted">
            Besoin d'un accès ? Demandez-le à l'administrateur de votre espace.
        </p>
    </Stack>
</Page>

<script lang="ts">
    import { Dropzone, SettingsSection } from '@facile/muse';
</script>

<SettingsSection
    bare
    title="Logo de l'espace"
    description="Affiché sur les factures et les documents partagés."
>
    <Dropzone
        accept="image/png,image/svg+xml"
        label="Déposez un PNG ou un SVG"
        hint="512 × 512 px recommandé"
    />
</SettingsSection>

<script lang="ts">
    import { Field, Input, ProfileSection, Textarea, SettingsRow, Stack, SwatchPicker, USER_COLOR_LABELS, USER_COLORS } from '@facile/muse';

    let displayName = $state('Camille');
    let bio = $state('');
    let identityColor = $state<string>(USER_COLORS[0]);
</script>

<Stack gap="section">
    <ProfileSection name="Camille Laurent" email="camille@facile.studio" role="owner" color={identityColor}>
        <SettingsRow label="Identity colour" description="How you appear on charts and calendars in this app." stacked>
            <SwatchPicker
                colors={USER_COLORS}
                labels={USER_COLOR_LABELS}
                bind:value={identityColor}
                label="Identity colour"
            />
        </SettingsRow>
        <SettingsRow label="About you" description="Stacked rows give the field the full width." stacked>
            <Field label="Display name">
                <Input bind:value={displayName} />
            </Field>
            <Field label="Bio">
                <Textarea bind:value={bio} />
            </Field>
        </SettingsRow>
    </ProfileSection>
</Stack>

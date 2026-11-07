<script lang="ts">
    import { ProfileSection, SettingsRow, Stack, SwatchPicker, USER_COLOR_LABELS, USER_COLORS } from '@facile/muse';

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
    </ProfileSection>
</Stack>

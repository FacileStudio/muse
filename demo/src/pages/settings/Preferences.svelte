<script lang="ts">
    import { PreferencesSection, SettingsRow, Stack, Switch } from '@facile/muse';
    import { setTheme, theme } from '../../theme.svelte.js';

    let compact = $state(true);
</script>

<Stack gap="section">
    <PreferencesSection theme={theme.mode} onThemeChange={setTheme}>
        <SettingsRow label="Compact mode" description="Tighter rows, more on screen.">
            <Switch bind:checked={compact} aria-label="Compact mode" />
        </SettingsRow>
    </PreferencesSection>
</Stack>

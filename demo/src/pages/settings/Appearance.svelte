<script lang="ts">
    import {
        ColorPicker,
        Select,
        SettingsRow,
        SettingsSection,
        Stack,
        Switch,
        USER_COLOR_LABELS,
        USER_COLORS
    } from '@facile/muse';

    let compactMode = $state(true);
    let sidebarCollapsed = $state(false);
    let language = $state('en');
    let timezone = $state('Europe/Paris');
    let brandColor = $state('#7eeedb');

</script>

<Stack>
    <SettingsSection
        title="Theme"
        description="Applied to this browser. Every device you sign in from keeps its own choice."
    >
        <SettingsRow
            label="Compact mode"
            description="Tighter rows and smaller cards — more on screen, less breathing room."
        >
            <Switch bind:checked={compactMode} aria-label="Compact mode" />
        </SettingsRow>

        <SettingsRow
            label="Start with the sidebar collapsed"
            description="The rail opens on hover either way; this only sets how it loads."
        >
            <Switch bind:checked={sidebarCollapsed} aria-label="Start with the sidebar collapsed" />
        </SettingsRow>
    </SettingsSection>

    <SettingsSection
        title="Brand"
        description="Applied to public pages — the client portal, invoices and shared reports."
    >
        <SettingsRow
            label="Brand colour"
            description="Any colour. Pick it, or paste a hex from wherever the brand book lives."
            stacked
        >
            <ColorPicker
                bind:value={brandColor}
                swatches={USER_COLORS}
                labels={USER_COLOR_LABELS}
                aria-label="Brand colour"
                class="max-w-xs"
            />
        </SettingsRow>
    </SettingsSection>

    <SettingsSection
        title="Language and region"
        description="Formats dates, numbers and the day your week starts on."
    >
        <SettingsRow label="Language" description="The interface language, not your content." for="language">
            <Select bind:value={language} id="language" class="w-full sm:w-56">
                <option value="en">English</option>
                <option value="fr">Français</option>
            </Select>
        </SettingsRow>

        <SettingsRow
            label="Timezone"
            description="Timers, reports and exports are stamped in this zone."
            for="timezone"
        >
            <Select bind:value={timezone} id="timezone" class="w-full sm:w-56">
                <option value="Europe/Paris">Europe / Paris</option>
                <option value="Europe/London">Europe / London</option>
                <option value="America/New_York">America / New York</option>
                <option value="UTC">UTC</option>
            </Select>
        </SettingsRow>
    </SettingsSection>
</Stack>

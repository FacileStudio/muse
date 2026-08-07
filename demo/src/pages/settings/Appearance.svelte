<script lang="ts">
    import { OptionCards, Select, SettingsRow, SettingsSection, Switch, icons } from '@facile/muse';
    import { setTheme, theme, type ThemeMode } from '../../theme.svelte.js';

    let compactMode = $state(true);
    let sidebarCollapsed = $state(false);
    let language = $state('en');
    let timezone = $state('Europe/Paris');

    const modes = [
        { value: 'system', label: 'System', icon: icons.monitor },
        { value: 'light', label: 'Light', icon: icons.sun },
        { value: 'dark', label: 'Dark', icon: icons.moon }
    ];

    let mode = $state<string>(theme.mode);

    $effect(() => {
        setTheme(mode as ThemeMode);
    });
</script>

<div class="flex flex-col gap-10">
    <SettingsSection
        title="Theme"
        description="Applied to this browser. Every device you sign in from keeps its own choice."
    >
        <SettingsRow
            label="Colour scheme"
            description="System follows your OS for as long as the app is open."
            stacked
        >
            <OptionCards
                options={modes}
                bind:value={mode}
                name="theme-mode"
                label="Colour scheme"
            />
        </SettingsRow>

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
</div>

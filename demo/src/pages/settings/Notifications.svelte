<script lang="ts">
    import {
        Alert,
        Select,
        SettingsRow,
        SettingsSection,
        Stack,
        Switch
    } from '@facile/muse';

    let emailNotifications = $state(true);
    let mentions = $state(true);
    let assignments = $state(true);
    let weeklyDigest = $state(false);
    let digestDay = $state('monday');
    let poolAlerts = $state(true);
</script>

<Stack gap="section">
    <SettingsSection
        title="Email"
        description="Nothing here is marketing — turn it all off and the app still works."
    >
        <SettingsRow
            label="Email notifications"
            description="The master switch. Off means we never email you about activity."
        >
            <Switch bind:checked={emailNotifications} aria-label="Email notifications" />
        </SettingsRow>

        <SettingsRow label="Mentions" description="Someone writes your name in a comment.">
            <Switch
                bind:checked={mentions}
                disabled={!emailNotifications}
                aria-label="Mentions"
            />
        </SettingsRow>

        <SettingsRow label="Assignments" description="A task or a document lands on you.">
            <Switch
                bind:checked={assignments}
                disabled={!emailNotifications}
                aria-label="Assignments"
            />
        </SettingsRow>

        {#if !emailNotifications}
            <Alert tone="info">
                Email is off, so the rows above stay as they are and simply do not fire.
            </Alert>
        {/if}
    </SettingsSection>

    <SettingsSection
        title="Digest"
        description="One summary instead of a stream of individual emails."
    >
        <SettingsRow
            label="Weekly digest"
            description="Tracked hours, open invoices and anything still assigned to you."
        >
            <Switch bind:checked={weeklyDigest} aria-label="Weekly digest" />
        </SettingsRow>

        {#if weeklyDigest}
            <SettingsRow label="Send it on" description="Sent at 08:00 in your timezone." for="digest-day">
                <Select bind:value={digestDay} id="digest-day" class="w-full sm:w-56">
                    <option value="monday">Monday</option>
                    <option value="friday">Friday</option>
                    <option value="sunday">Sunday</option>
                </Select>
            </SettingsRow>
        {/if}
    </SettingsSection>

    <SettingsSection
        title="System"
        description="Operational noise. Worth keeping on if you own the instance."
    >
        <SettingsRow
            label="Pool disconnections"
            description="Tell me when this app stops talking to Antenne for more than five minutes."
        >
            <Switch bind:checked={poolAlerts} aria-label="Pool disconnections" />
        </SettingsRow>
    </SettingsSection>
</Stack>

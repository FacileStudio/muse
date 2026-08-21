<script lang="ts">
    import {
        Alert,
        Badge,
        Button,
        icons,
        Input,
        REDACTED,
        SecretField,
        SettingsRow,
        SettingsSection,
        Stack,
        StatusDot,
        Switch
    } from '@facile/muse';
    import { wait } from '../../data.js';

    type State = 'off' | 'connecting' | 'connected' | 'reconnecting' | 'failed';

    let enabled = $state(true);
    let instance = $state('https://antenne.facile.studio');
    let secret = $state(REDACTED);
    let connection = $state<State>('connected');
    let attempt = $state(0);
    let saving = $state(false);

    const channels = $state([
        { id: 'time_entry.created', label: 'Time entry started', on: true },
        { id: 'time_entry.updated', label: 'Time entry changed', on: true },
        { id: 'project.created', label: 'Project created', on: true },
        { id: 'project.updated', label: 'Project changed', on: false },
        { id: 'project.deleted', label: 'Project deleted', on: true },
        { id: 'task.created', label: 'Task created', on: false }
    ]);

    /*
     * Four states, not a boolean. "Not connected" covers a switch that is off, a handshake in
     * flight and a client that has burned all twenty retries — three situations with three
     * different things to do about them, and telling them apart is the whole job of this card.
     */
    const status = $derived.by((): { tone: 'success' | 'warning' | 'danger' | 'neutral'; label: string; pulse: boolean } => {
        if (!enabled) return { tone: 'neutral', label: 'Disabled', pulse: false };
        switch (connection) {
            case 'connected':
                return { tone: 'success', label: 'Connected', pulse: false };
            case 'connecting':
                return { tone: 'warning', label: 'Connecting…', pulse: true };
            case 'reconnecting':
                return { tone: 'warning', label: `Reconnecting — attempt ${attempt} of 20`, pulse: true };
            case 'failed':
                return { tone: 'danger', label: 'Gave up after 20 attempts', pulse: false };
            default:
                return { tone: 'neutral', label: 'Not connected', pulse: false };
        }
    });

    async function connect() {
        saving = true;
        connection = 'connecting';
        await wait(900);
        connection = 'connected';
        attempt = 0;
        saving = false;
    }

    async function simulateDrop() {
        connection = 'reconnecting';
        for (attempt = 1; attempt <= 3; attempt++) await wait(600);
        connection = 'connected';
        attempt = 0;
    }
</script>

<Stack gap="section">
    <SettingsSection
        title="Antenne Pool"
        description="One socket to Antenne carries every event this app emits. Apps never talk to each other directly."
    >
        {#snippet actions()}
            <Button
                variant="outline"
                icon={icons.refresh}
                disabled={!enabled || connection === 'connecting'}
                onclick={connect}
            >
                Reconnect
            </Button>
        {/snippet}

        <SettingsRow label="Status" description="Live, from the socket itself — not from the last save.">
            <StatusDot tone={status.tone} label={status.label} pulse={status.pulse} />
        </SettingsRow>

        <SettingsRow label="Emit events" description="Off keeps the config but stops the socket.">
            <Switch bind:checked={enabled} aria-label="Emit events" />
        </SettingsRow>

        <SettingsRow label="Identity" description="How this app names itself on the pool." stacked>
            <SecretField value="muse:acme" sensitive={false} class="w-full" />
        </SettingsRow>

        <SettingsRow
            label="Epoch"
            description="Changes when Antenne restarts and replays are re-anchored."
            stacked
        >
            <SecretField value="7f3a9c21" sensitive={false} class="w-full" />
        </SettingsRow>

        <SettingsRow label="Outbox" description="Events held locally until the socket comes back.">
            <Badge tone={connection === 'connected' ? 'neutral' : 'accent'}>0 pending</Badge>
        </SettingsRow>

        {#if connection === 'failed'}
            <Alert tone="danger" title="Connection abandoned">
                The client stops retrying after twenty attempts and stays down until something
                wakes it. Check that Antenne is reachable, then reconnect.
            </Alert>
        {/if}
    </SettingsSection>

    <SettingsSection
        title="Connection"
        description="Where Antenne lives and the shared secret that registers this app with it."
    >
        <SettingsRow
            label="Instance URL"
            description="Scheme included. The socket URL is derived from it."
            for="pool-url"
            stacked
        >
            <Input bind:value={instance} id="pool-url" placeholder="https://antenne.example.com" />
        </SettingsRow>

        <SettingsRow
            label="Shared secret"
            description="Posted once to /api/pool/register. Stored hashed — it is never sent back."
            stacked
        >
            <SecretField
                bind:value={secret}
                editable
                helper={secret === REDACTED
                    ? 'A stored secret is shown as dots. Type over it to replace it; leave it to keep it.'
                    : 'This replaces the stored secret when you save.'}
                class="w-full"
            />
        </SettingsRow>

        <div class="flex flex-wrap gap-2 pt-2">
            <Button icon={icons.plug} disabled={saving} onclick={connect}>
                {saving ? 'Connecting…' : 'Save and connect'}
            </Button>
            <Button variant="outline" onclick={simulateDrop} disabled={!enabled}>
                Simulate a drop
            </Button>
        </div>
    </SettingsSection>

    <SettingsSection
        title="Channels"
        description="What this app publishes. Anything off is never emitted, not just filtered on arrival."
    >
        {#each channels as channel (channel.id)}
            <SettingsRow label={channel.label} description={channel.id}>
                <Switch bind:checked={channel.on} aria-label={channel.label} />
            </SettingsRow>
        {/each}
    </SettingsSection>
</Stack>

<script lang="ts">
    import {
        Alert,
        Button,
        ConfirmModal,
        icons,
        SecretField,
        SettingsRow,
        SettingsSection,
        Stack
    } from '@facile/muse';
    import { wait } from '../../data.js';

    let exporting = $state(false);
    let exported = $state(false);

    let deleteOpen = $state(false);
    let deleteScheduled = $state(false);

    async function exportData() {
        exporting = true;
        await wait(1200);
        exporting = false;
        exported = true;
    }

    async function deleteAccount() {
        await wait(1200);
        deleteScheduled = true;
    }
</script>

<Stack gap="section">
    <SettingsSection
        title="Your data"
        description="Everything this workspace holds about you, as JSON, in one archive."
    >
        <SettingsRow
            label="Export"
            description="We email a download link when it is ready. The link lasts 24 hours."
        >
            <Button variant="outline" icon={icons.download} disabled={exporting} onclick={exportData}>
                {exporting ? 'Preparing…' : 'Export my data'}
            </Button>
        </SettingsRow>

        {#if exported}
            <Alert tone="success">Export queued. Check your inbox in a minute or two.</Alert>
        {/if}
    </SettingsSection>

    <SettingsSection title="Instance" description="Useful when you file a bug against a self-hosted install.">
        <SettingsRow label="Version" stacked>
            <SecretField value="2026.8.1" sensitive={false} class="w-full" />
        </SettingsRow>
        <SettingsRow label="Identity provider" description="Federated over OIDC." stacked>
            <SecretField value="porte.facile.studio" sensitive={false} class="w-full" />
        </SettingsRow>
        <SettingsRow label="Support bundle" description="Redacted config and the last 200 log lines." stacked>
            <SecretField
                value="fc-support-4b19c0e2-acme"
                sensitive={false}
                helper="Quote this when you open a ticket — it points support at your instance."
                class="w-full"
            />
        </SettingsRow>
    </SettingsSection>

    <!--
        Danger zone is its own section at the end of the last tab, never a tab of its own: a
        destructive action deserves a scroll and a heading, not a place in the top-level
        navigation where it sits one mis-click away all day.
    -->
    <SettingsSection
        title="Danger zone"
        description="Irreversible, and nobody can undo it for you."
    >
        <SettingsRow
            label="Delete this account"
            description="Removes you from every space and deletes your tracked time, invoices and files."
        >
            <Button variant="danger" icon={icons.remove} onclick={() => (deleteOpen = true)}>
                Delete account
            </Button>
        </SettingsRow>

        {#if deleteScheduled}
            <Alert tone="danger">
                Deletion scheduled. You have 30 days to sign back in and cancel it.
            </Alert>
        {/if}
    </SettingsSection>
</Stack>

<ConfirmModal
    bind:open={deleteOpen}
    tone="danger"
    title="Delete your account?"
    description="Every space loses your entries, and your invoices go with them. This cannot be undone."
    confirmLabel="Delete account"
    cancelLabel="Keep my account"
    onConfirm={deleteAccount}
/>

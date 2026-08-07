<script lang="ts">
    import {
        Alert,
        Badge,
        Button,
        ConfirmModal,
        Drawer,
        Field,
        Input,
        SecretField,
        Select,
        SettingsSection,
        Spinner,
        Table,
        icons
    } from '@facile/lib';
    import { wait } from '../../data.js';

    type Token = {
        id: string;
        name: string;
        scope: 'read' | 'read,write';
        prefix: string;
        lastUsed: string | null;
        expires: string;
        revoked?: boolean;
    };

    let tokens = $state<Token[]>([
        {
            id: 't1',
            name: 'ci-deploy',
            scope: 'read,write',
            prefix: 'fc_rw_a91c',
            lastUsed: '2 hours ago',
            expires: '12 Nov 2026'
        },
        {
            id: 't2',
            name: 'laptop-cli',
            scope: 'read',
            prefix: 'fc_ro_4d20',
            lastUsed: 'Never',
            expires: '3 Mar 2027'
        },
        {
            id: 't3',
            name: 'old-runner',
            scope: 'read',
            prefix: 'fc_ro_77bb',
            lastUsed: '4 months ago',
            expires: '1 Feb 2026',
            revoked: true
        }
    ]);

    let endpoint = $state('https://acme.facile.studio/api/v1');

    let createOpen = $state(false);
    let creating = $state(false);
    let createdToken = $state('');
    let newName = $state('');
    let newScope = $state('read');
    let newExpiry = $state('90');

    let revokeTarget = $state<Token | null>(null);
    let revokeOpen = $state(false);

    function openCreate() {
        /* Reset first: reopening the drawer must never re-show a token from a previous run. */
        createdToken = '';
        newName = '';
        newScope = 'read';
        newExpiry = '90';
        createOpen = true;
    }

    async function create(e: Event) {
        e.preventDefault();
        creating = true;
        await wait(700);
        const prefix = newScope === 'read' ? 'fc_ro' : 'fc_rw';
        const body = crypto.randomUUID().replace(/-/g, '');
        createdToken = `${prefix}_${body}`;
        tokens = [
            {
                id: crypto.randomUUID(),
                name: newName.trim(),
                scope: newScope as Token['scope'],
                prefix: `${prefix}_${body.slice(0, 4)}`,
                lastUsed: 'Never',
                expires: `in ${newExpiry} days`
            },
            ...tokens
        ];
        creating = false;
    }

    async function revoke() {
        await wait(600);
        const id = revokeTarget?.id;
        tokens = tokens.map((t) => (t.id === id ? { ...t, revoked: true } : t));
        revokeTarget = null;
    }
</script>

<div class="flex flex-col gap-10">
    <SettingsSection
        title="Endpoint"
        description="Point the CLI or any HTTP client here. Not a secret — the token is."
    >
        <SecretField value={endpoint} sensitive={false} label="Base URL" />
    </SettingsSection>

    <SettingsSection
        title="API tokens"
        description="One token per machine. Revoking one never touches the others."
        bare
    >
        {#snippet actions()}
            <Button icon={icons.plus} onclick={openCreate}>New token</Button>
        {/snippet}

        {#if tokens.length === 0}
            <Alert tone="info">No tokens yet. The CLI needs one before it can talk to this workspace.</Alert>
        {:else}
            <Table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Token</th>
                        <th>Scope</th>
                        <th>Last used</th>
                        <th>Expires</th>
                        <th class="text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each tokens as token (token.id)}
                        <tr class={token.revoked ? 'opacity-55' : ''}>
                            <td class="font-medium text-fc-fg">{token.name}</td>
                            <td class="font-fc-mono text-fc-xs text-fc-fg-muted">{token.prefix}…</td>
                            <td>
                                <Badge tone={token.scope.includes('write') ? 'accent' : 'neutral'}>
                                    {token.scope === 'read' ? 'read' : 'read + write'}
                                </Badge>
                            </td>
                            <td class="whitespace-nowrap text-fc-fg-muted">{token.lastUsed}</td>
                            <td class="whitespace-nowrap text-fc-fg-muted">{token.expires}</td>
                            <td class="text-right">
                                {#if token.revoked}
                                    <Badge>Revoked</Badge>
                                {:else}
                                    <Button
                                        variant="ghost-danger"
                                        size="sm"
                                        icon={icons.revoke}
                                        onclick={() => {
                                            revokeTarget = token;
                                            revokeOpen = true;
                                        }}
                                    >
                                        Revoke
                                    </Button>
                                {/if}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </Table>
        {/if}
    </SettingsSection>
</div>

<Drawer bind:open={createOpen} title="New API token">
    {#if createdToken}
        <div class="flex flex-col gap-4">
            <Alert tone="warning" title="Copy it now">
                This is the only time the token is shown. We store a hash, so we cannot show it
                to you again — losing it means issuing a new one.
            </Alert>

            <!--
                The one-time token is the exception to the auto-hide rule: it starts revealed and
                stays that way, because hiding a value the user has not copied yet is theatre.
            -->
            <SecretField
                value={createdToken}
                visible
                autoHideMs={0}
                label="Token"
                helper="Store it in your password manager or your CI secret store."
            />

            <div class="flex justify-end">
                <Button onclick={() => (createOpen = false)}>Done</Button>
            </div>
        </div>
    {:else}
        <form class="flex flex-col gap-4" onsubmit={create}>
            <Field label="Name" helper="Where the token will live — a machine, a pipeline, a script.">
                <Input bind:value={newName} placeholder="ci-deploy" required disabled={creating} />
            </Field>

            <Field label="Scope">
                <Select bind:value={newScope} disabled={creating}>
                    <option value="read">Read — fetch data</option>
                    <option value="read,write">Read and write — fetch and change data</option>
                </Select>
            </Field>

            <Field
                label="Expires in"
                helper="A machine credential that never lapses is the one nobody remembers to rotate."
            >
                <Select bind:value={newExpiry} disabled={creating}>
                    <option value="30">30 days</option>
                    <option value="90">90 days</option>
                    <option value="365">1 year</option>
                </Select>
            </Field>

            <div class="flex justify-end gap-2 pt-1">
                <Button
                    type="button"
                    variant="ghost"
                    disabled={creating}
                    onclick={() => (createOpen = false)}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={creating || newName.trim().length === 0}>
                    {#if creating}<Spinner size="sm" />{/if}
                    {creating ? 'Creating…' : 'Create token'}
                </Button>
            </div>
        </form>
    {/if}
</Drawer>

<ConfirmModal
    bind:open={revokeOpen}
    tone="danger"
    title="Revoke this token?"
    description={`"${revokeTarget?.name ?? ''}" stops working immediately, and any pipeline or CLI still using it starts failing. It cannot be un-revoked. The row stays listed so the audit log still names what it did.`}
    confirmLabel="Revoke token"
    cancelLabel="Keep it"
    onConfirm={revoke}
/>

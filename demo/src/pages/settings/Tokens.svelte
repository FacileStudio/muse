<script lang="ts">
    import { Stack, TokensSection, type TokenItem } from '@facile/muse';
    import { wait } from '../../data.js';

    let tokens = $state<TokenItem[]>([
        { id: '1', name: 'CI pipeline', prefix: 'fc_rw_4b19', scope: 'Read and write', lastUsed: 'Today', expires: 'Jan 2027' },
        { id: '2', name: 'Old laptop', prefix: 'fc_ro_91ac', scope: 'Read only', lastUsed: 'Mar 2026', revoked: true }
    ]);

    async function create(draft: { name: string; scope?: string; days: number }): Promise<string> {
        await wait(600);
        const id = String(tokens.length + 1);
        tokens = [...tokens, { id, name: draft.name, prefix: 'fc_rw_77d0', scope: draft.scope, expires: `${draft.days} days` }];
        return 'fc_rw_77d0c1e29ab34f5d8e60b1c2a3d4e5f6';
    }

    async function revoke(token: TokenItem) {
        await wait(400);
        tokens = tokens.map((t) => (t.id === token.id ? { ...t, revoked: true } : t));
    }
</script>

<Stack gap="section">
    <TokensSection
        {tokens}
        onCreate={create}
        onRevoke={revoke}
        scopes={[
            { value: 'rw', label: 'Read and write' },
            { value: 'ro', label: 'Read only' }
        ]}
    />
</Stack>

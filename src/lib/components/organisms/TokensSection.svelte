<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { SelectOption } from '../atoms/Select.svelte';
    import type { SettingsSectionProps } from '../molecules/SettingsSection.svelte';
    import type { TokenDraft } from './TokenCreate.svelte';

    export type TokenItem = {
        id: string;
        name: string;
        prefix?: string;
        scope?: string;
        lastUsed?: string;
        expires?: string;
        revoked?: boolean;
    };

    export interface TokensSectionProps extends Omit<SettingsSectionProps, 'actions' | 'bare' | 'children'> {
        tokens: TokenItem[];
        /** Creates the token and returns its secret, shown once and never again. */
        onCreate: (draft: TokenDraft) => Promise<string>;
        /** Revokes after the confirmation. A rejected promise keeps the dialog open. */
        onRevoke: (token: TokenItem) => void | Promise<void>;
        scopes?: SelectOption[];
        /** The expiry choices, in days. A token always has one. */
        expiryDays?: number[];
        children?: Snippet;
    }
</script>

<script lang="ts">
    import { getI18n } from '../../i18n/context.svelte.js';
    import { icons } from '../../icons.js';
    import { twMerge } from '../../utils/cn.js';
    import Badge from '../atoms/Badge.svelte';
    import Button from '../atoms/Button.svelte';
    import SettingsSection from '../molecules/SettingsSection.svelte';
    import ConfirmModal from './ConfirmModal.svelte';
    import Table from './Table.svelte';
    import TokenCreate from './TokenCreate.svelte';

    let {
        tokens,
        onCreate,
        onRevoke,
        scopes = [],
        expiryDays = [30, 90, 365],
        children,
        title,
        description,
        ...rest
    }: TokensSectionProps = $props();

    const i18n = getI18n();
    let creating = $state(false);
    let revoking = $state<TokenItem | null>(null);
    let confirming = $state(false);
    const never = $derived(i18n.t('settings.tokens.never'));
    const columns = $derived([i18n.t('settings.tokens.name'), i18n.t('settings.tokens.prefix'), i18n.t('settings.tokens.lastUsed'), i18n.t('settings.tokens.expires')]);
</script>

<!--
@component
La section des jetons d'API : liste, création dans un tiroir avec secret affiché une fois, révocation confirmée. Les jetons révoqués restent listés.
-->

<SettingsSection
    bare
    title={title ?? i18n.t('settings.tokens.title')}
    description={description ?? i18n.t('settings.tokens.description')}
    {...rest}
>
    {#snippet actions()}
        <Button icon={icons.plus} onclick={() => (creating = true)}>{i18n.t('settings.tokens.create')}</Button>
    {/snippet}

    {#if tokens.length === 0}
        <p class="text-fc-sm text-fc-fg-muted">{i18n.t('settings.tokens.empty')}</p>
    {:else}
        <Table class="[&_td]:whitespace-nowrap [&_th]:whitespace-nowrap">
            <thead>
                <tr>
                    {#each columns as column (column)}<th>{column}</th>{/each}
                    <th><span class="sr-only">{i18n.t('settings.tokens.revoke')}</span></th>
                </tr>
            </thead>
            <tbody>
                {#each tokens as token (token.id)}
                    <tr class={twMerge(token.revoked && 'opacity-55')}>
                        <td class="font-medium">
                            <span class="flex items-center gap-2">
                                {token.name}
                                {#if token.scope}<Badge class="shrink-0">{token.scope}</Badge>{/if}
                                {#if token.revoked}<Badge tone="danger" class="shrink-0">{i18n.t('settings.tokens.revoked')}</Badge>{/if}
                            </span>
                        </td>
                        <td class="font-mono text-fc-xs">{token.prefix ?? ''}</td>
                        <td>{token.lastUsed ?? never}</td>
                        <td>{token.expires ?? never}</td>
                        <td class="text-right">
                            {#if !token.revoked}
                                <Button
                                    variant="ghost-danger"
                                    size="sm"
                                    icon={icons.revoke}
                                    aria-label="{i18n.t('settings.tokens.revoke')} {token.name}"
                                    onclick={() => {
                                        revoking = token;
                                        confirming = true;
                                    }}
                                >
                                    {i18n.t('settings.tokens.revoke')}
                                </Button>
                            {/if}
                        </td>
                    </tr>
                {/each}
            </tbody>
        </Table>
    {/if}
    {@render children?.()}
</SettingsSection>

<TokenCreate bind:open={creating} {scopes} {expiryDays} {onCreate} />

<ConfirmModal
    bind:open={confirming}
    tone="danger"
    icon={icons.revoke}
    title={i18n.t('settings.tokens.revokeTitle')}
    description={i18n.t('settings.tokens.revokeBody')}
    confirmLabel={i18n.t('settings.tokens.revoke')}
    onConfirm={async () => {
        if (revoking) await onRevoke(revoking);
    }}
/>

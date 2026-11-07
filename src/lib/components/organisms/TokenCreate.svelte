<script module lang="ts">
    import type { SelectOption } from '../atoms/Select.svelte';

    export type TokenDraft = { name: string; scope?: string; days: number };

    export interface TokenCreateProps {
        open: boolean;
        scopes: SelectOption[];
        expiryDays: number[];
        expiry?: boolean;
        onCreate: (draft: TokenDraft) => Promise<string>;
    }
</script>

<script lang="ts">
    import { getI18n } from '../../i18n/context.svelte.js';
    import Alert from '../atoms/Alert.svelte';
    import Button from '../atoms/Button.svelte';
    import Input from '../atoms/Input.svelte';
    import Select from '../atoms/Select.svelte';
    import Field from '../molecules/Field.svelte';
    import SecretField from '../molecules/SecretField.svelte';
    import { latestOnly } from '../../utils/secret.js';
    import Drawer from './Drawer.svelte';

    let { open = $bindable(false), scopes, expiryDays, expiry: asksExpiry = true, onCreate }: TokenCreateProps = $props();

    const i18n = getI18n();
    const days = $derived(
        expiryDays.map((count) => ({ value: String(count), label: i18n.t('settings.tokens.days', { count }) }))
    );

    let name = $state('');
    let scope = $state('');
    let expiry = $state('');
    let secret = $state('');
    let failure = $state('');
    let pending = $state(false);
    const run = latestOnly();

    $effect(() => {
        if (open) return;
        run.cancel();
        name = '';
        scope = scopes[0]?.value ?? '';
        expiry = days[0]?.value ?? '';
        secret = '';
        failure = '';
        pending = false;
    });

    async function submit(event: SubmitEvent) {
        event.preventDefault();
        const turn = run.begin();
        pending = true;
        failure = '';
        try {
            const created = await onCreate({ name: name.trim(), scope: scope || undefined, ...(asksExpiry ? { days: Number(expiry) } : {}) } as TokenDraft);
            if (!run.stale(turn)) secret = created;
        } catch (error) {
            if (!run.stale(turn)) failure = error instanceof Error ? error.message : String(error);
        } finally {
            if (!run.stale(turn)) pending = false;
        }
    }
</script>

<!--
@component
Le tiroir de création d'un jeton : nom, accès et expiration obligatoire, puis le secret affiché une seule fois. Il se réinitialise à chaque ouverture.
-->

<Drawer bind:open title={i18n.t('settings.tokens.create')}>
    {#if secret}
        <div class="flex flex-col gap-4">
            <Alert tone="warning">{i18n.t('settings.tokens.copyWarning')}</Alert>
            <SecretField value={secret} visible autoHideMs={0} label={i18n.t('settings.tokens.prefix')} />
            <Button onclick={() => (open = false)}>{i18n.t('settings.tokens.done')}</Button>
        </div>
    {:else}
        <form class="flex flex-col gap-4" onsubmit={submit}>
            <Field label={i18n.t('settings.tokens.name')} error={failure || undefined}>
                <Input bind:value={name} required maxlength={80} autocomplete="off" />
            </Field>
            {#if scopes.length > 0}
                <Field label={i18n.t('settings.tokens.scope')}>
                    <Select bind:value={scope} options={scopes} />
                </Field>
            {/if}
            {#if asksExpiry}
                <Field label={i18n.t('settings.tokens.expiry')}>
                    <Select bind:value={expiry} options={days} />
                </Field>
            {/if}
            <Button type="submit" disabled={pending || name.trim() === ''}>{i18n.t('settings.tokens.submit')}</Button>
        </form>
    {/if}
</Drawer>

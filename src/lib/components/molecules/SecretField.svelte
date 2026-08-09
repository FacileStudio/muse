<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';

    export interface SecretFieldProps extends HTMLAttributes<HTMLDivElement> {
        value?: string;
        label?: string;
        helper?: string;
        error?: string;
        placeholder?: string;
        editable?: boolean;
        sensitive?: boolean;
        copyable?: boolean;
        mask?: 'ends' | 'full';
        visible?: boolean;
        autoHideMs?: number;
        disabled?: boolean;
        for?: string;
        actions?: Snippet;
        onReveal?: (visible: boolean) => void;
        onCopy?: (ok: boolean) => void;
        class?: string;

    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { icons } from '../../icons.js';
    import { isRedacted, maskSecret } from '../../utils/secret.js';
    import IconButton from '../atoms/IconButton.svelte';

    let {
        value = $bindable(''),
        label,
        helper,
        error,
        placeholder = '',
        editable = false,
        sensitive = true,
        copyable = true,
        mask = 'ends',
        visible = $bindable(false),
        autoHideMs = 15000,
        disabled = false,
        for: htmlFor,
        actions,
        onReveal,
        onCopy,
        class: className = '',
        ...rest
    }: SecretFieldProps = $props();

    const uid = $props.id();
    const id = $derived(htmlFor ?? `${uid}-secret`);

    let status = $state('');
    let copyTick = $state(0);

    const copied = $derived(copyTick > 0);
    const empty = $derived(value.length === 0);

    /*
     * A value the server redacted is a placeholder, not a secret: there is nothing to reveal
     * and nothing worth copying, so both affordances go dead rather than handing the user
     * eight dots and a "Copied" toast.
     */
    const stored = $derived(isRedacted(value));
    const inert = $derived(disabled || empty || stored);
    const shown = $derived(visible || !sensitive ? value : maskSecret(value, mask));

    function toggle() {
        visible = !visible;
        onReveal?.(visible);
        status = visible ? 'Secret revealed' : 'Secret hidden';
    }

    /*
     * Revealing is a peek, not a mode: a secret left on screen ends up in a screen share or a
     * screenshot long after the person who revealed it walked away. The timer restarts on
     * every reveal and is cancelled the moment it is hidden by hand.
     */
    $effect(() => {
        if (!visible || autoHideMs <= 0) return;
        const timer = setTimeout(() => {
            visible = false;
            status = 'Secret hidden again';
        }, autoHideMs);
        return () => clearTimeout(timer);
    });

    async function copy() {
        try {
            await navigator.clipboard.writeText(value);
            copyTick += 1;
            status = 'Copied to clipboard';
            onCopy?.(true);
        } catch {
            status = 'Could not copy — reveal it and copy by hand';
            onCopy?.(false);
        }
    }

    /*
     * The tick is a 2s flash on the copy button, so the timer has to die with the component:
     * unmounting mid-flash otherwise leaves a timeout writing to state nobody is rendering.
     * Re-copying bumps the counter, which restarts the effect and therefore the countdown.
     */
    $effect(() => {
        if (copyTick === 0) return;
        const timer = setTimeout(() => (copyTick = 0), 2000);
        return () => clearTimeout(timer);
    });

    const errorId = `${uid}-error`;
    const helperId = `${uid}-helper`;
    const describedBy = $derived(error ? errorId : helper ? helperId : undefined);

    const box =
        'flex h-11 min-w-0 flex-1 items-center rounded-fc-md border border-fc-border bg-fc-bg px-3 font-fc-mono text-fc-sm';
</script>

<!-- `relative` contains the `sr-only` live region — see the note in `Switch.svelte`. -->
<div class={twMerge('relative flex flex-col gap-1.5', className)} {...rest}>
    {#if label}
        <label for={id} class="text-fc-sm text-fc-fg">{label}</label>
    {/if}

    <div class="flex items-center gap-2">
        {#if editable}
            <input
                {id}
                bind:value
                {placeholder}
                {disabled}
                type={visible || !sensitive ? 'text' : 'password'}
                autocomplete="off"
                autocapitalize="off"
                autocorrect="off"
                spellcheck="false"
                aria-invalid={error ? 'true' : undefined}
                aria-describedby={describedBy}
                class={twMerge(
                    box,
                    'text-fc-fg placeholder:font-sans placeholder:text-fc-fg-muted focus:outline-2 focus:outline-fc-ring disabled:opacity-50'
                )}
            />
        {:else}
            <output
                {id}
                aria-describedby={describedBy}
                class={twMerge(box, empty ? 'text-fc-fg-muted' : 'text-fc-fg')}
                title={visible || !sensitive ? value : undefined}
            >
                <span class={visible || !sensitive ? 'truncate select-all' : 'truncate select-none'}
                    >{empty ? placeholder || 'Not set' : shown}</span
                >
            </output>
        {/if}

        {#if sensitive}
            <IconButton
                onclick={toggle}
                disabled={inert}
                aria-label={visible ? 'Hide secret' : 'Reveal secret'}
                aria-pressed={visible}
                title={visible ? 'Hide' : 'Reveal'}
            >
                <iconify-icon
                    icon={visible ? icons.eyeClosed : icons.eye}
                    width="18"
                    height="18"
                    class="block size-4.5"
                ></iconify-icon>
            </IconButton>
        {/if}

        {#if copyable}
            <IconButton
                onclick={copy}
                disabled={inert}
                aria-label={sensitive ? 'Copy secret to clipboard' : 'Copy to clipboard'}
                title="Copy"
                class={copied ? 'border-fc-success text-fc-success' : ''}
            >
                <iconify-icon
                    icon={copied ? icons.check : icons.copy}
                    width="18"
                    height="18"
                    class="block size-4.5"
                ></iconify-icon>
            </IconButton>
        {/if}

        {#if actions}{@render actions()}{/if}
    </div>

    {#if error}
        <span id={errorId} class="text-fc-xs text-fc-danger">{error}</span>
    {:else if helper}
        <span id={helperId} class="text-fc-xs text-fc-fg-muted">{helper}</span>
    {/if}

    <span aria-live="polite" class="sr-only">{status}</span>
</div>

<script module lang="ts">
    import type { HTMLInputAttributes } from 'svelte/elements';

    export interface SearchFieldProps extends Omit<HTMLInputAttributes, 'value' | 'size' | 'type' | 'onsubmit'> {
        value?: string;
        /** Called with the text once typing pauses for `debounce` milliseconds, and at once on clear. */
        onSearch?: (value: string) => void;
        /** Called with the text when the user presses Enter. */
        onSubmit?: (value: string) => void;
        /** Milliseconds `onSearch` waits after the last keystroke. @default 250 */
        debounce?: number;
        /** A bare key that focuses the field from anywhere on the page, such as `/`. The field shows it as a hint. */
        shortcut?: string;
        /** `sm` is 36px on a fine pointer; every size is 44px on a touch screen. @default 'md' */
        size?: 'sm' | 'md' | 'lg';
        /** Fully rounded ends instead of the standard control radius. */
        pill?: boolean;
        /** Accessible name. Defaults to the translated "Search". */
        label?: string;
        /** Accessible name of the clear button. Defaults to the translated "Clear search". */
        clearLabel?: string;
        class?: string;
    }
</script>

<script lang="ts">
    import { onDestroy } from 'svelte';
    import { twMerge } from '../../utils/cn.js';
    import { getI18n } from '../../i18n/context.svelte.js';
    import { icons } from '../../icons.js';
    import { wantsFocus } from '../../utils/search.js';
    import Icon from '../atoms/Icon.svelte';
    import Kbd from '../atoms/Kbd.svelte';

    let {
        value = $bindable(''),
        onSearch,
        onSubmit,
        debounce = 250,
        shortcut,
        size = 'md',
        pill = false,
        label,
        clearLabel,
        class: className = '',
        ...rest
    }: SearchFieldProps = $props();

    const i18n = getI18n();

    let input: HTMLInputElement | null = $state(null);
    let timer: ReturnType<typeof setTimeout> | undefined;

    const heights = {
        sm: 'h-9 text-fc-sm [@media(pointer:coarse)]:h-11',
        md: 'h-11 text-fc-md',
        lg: 'h-14 text-fc-md'
    };

    function typed() {
        clearTimeout(timer);
        if (!onSearch) return;
        const text = value;
        if (debounce <= 0) onSearch(text);
        else timer = setTimeout(() => onSearch(text), debounce);
    }

    function clear() {
        clearTimeout(timer);
        value = '';
        onSearch?.('');
        input?.focus();
    }

    function keydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            clearTimeout(timer);
            onSubmit?.(value);
        } else if (event.key === 'Escape' && value) {
            event.preventDefault();
            event.stopPropagation();
            clear();
        }
    }

    function windowKey(event: KeyboardEvent) {
        if (!shortcut || !wantsFocus(event, event.target as HTMLElement | null, shortcut)) return;
        event.preventDefault();
        input?.focus();
        input?.select();
    }

    onDestroy(() => clearTimeout(timer));
</script>

<!--
@component
Un champ de recherche : loupe, croix pour effacer, Échap qui efface, saisie temporisée vers `onSearch`, Entrée vers `onSubmit` et, en option, une touche comme `/` qui donne le focus depuis n'importe où. Le champ est un aplat clair, sans bordure.
-->

<svelte:window onkeydown={windowKey} />

<div role="search" class={twMerge('relative w-full', className)}>
    <Icon icon={icons.search} size={size === 'lg' ? 22 : 18} class="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-fc-fg-muted" />
    <input
        bind:this={input}
        bind:value
        type="search"
        enterkeyhint="search"
        autocomplete="off"
        spellcheck="false"
        aria-label={label ?? i18n.t('search.label')}
        aria-keyshortcuts={shortcut}
        class={twMerge(
            'w-full bg-fc-field pr-11 pl-10 text-fc-fg placeholder:text-fc-fg-muted [&::-webkit-search-cancel-button]:appearance-none',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring disabled:cursor-not-allowed disabled:opacity-50',
            pill ? 'rounded-fc-pill' : 'rounded-fc-md',
            heights[size]
        )}
        {...rest}
        oninput={(event) => {
            rest.oninput?.(event);
            typed();
        }}
        onkeydown={(event) => {
            rest.onkeydown?.(event);
            keydown(event);
        }}
    />
    {#if value}
        <button
            type="button"
            aria-label={clearLabel ?? i18n.t('search.clear')}
            class="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center rounded-fc-md text-fc-fg-muted transition-colors hover:text-fc-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring"
            onclick={clear}
        >
            <Icon icon={icons.close} size={16} />
        </button>
    {:else if shortcut}
        <Kbd keys={shortcut} class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 [@media(pointer:coarse)]:hidden" />
    {/if}
</div>

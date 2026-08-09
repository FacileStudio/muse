<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

    export type Variant = 'primary' | 'ghost' | 'outline' | 'danger' | 'ghost-danger';

    export type Size = 'sm' | 'md' | 'lg';

    export interface ButtonProps extends Omit<HTMLButtonAttributes, 'type'> {
        href?: string;
        target?: HTMLAnchorAttributes['target'];
        rel?: HTMLAnchorAttributes['rel'];
        download?: HTMLAnchorAttributes['download'];
        type?: HTMLButtonAttributes['type'];
        variant?: Variant;
        size?: Size;
        disabled?: boolean;
        icon?: string;
        iconRight?: string;
        class?: string;
        children?: Snippet;

    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';

    let {
        href,
        type = 'button',
        variant = 'primary',
        size = 'md',
        disabled = false,
        icon,
        iconRight,
        class: className = '',
        children,
        ...rest
    }: ButtonProps = $props();

    const iconSizes: Record<Size, number> = { sm: 14, md: 16, lg: 18 };
    const glyph = $derived(iconSizes[size]);

    /*
     * The CSS twin of `glyph`. `<iconify-icon>` has no box until its data arrives from the
     * network, and the `width`/`height` *attributes* only take effect once it does — so a
     * button with an icon renders at label width and then jumps wider when the glyph lands.
     * A real class reserves the space up front. `Tabs` and `OptionCards` already did this and
     * say why; the rest of the library did not.
     */
    const glyphClass: Record<Size, string> = { sm: 'size-3.5', md: 'size-4', lg: 'size-4.5' };

    const variants: Record<Variant, string> = {
        primary: 'bg-fc-accent text-fc-accent-fg hover:opacity-90',
        ghost: 'bg-transparent text-fc-fg-muted hover:bg-fc-surface hover:text-fc-fg',
        outline: 'border border-fc-border bg-transparent text-fc-fg hover:bg-fc-surface',
        danger: 'bg-fc-danger/10 text-fc-danger hover:bg-fc-danger/20',
        'ghost-danger': 'bg-transparent text-fc-fg-muted hover:bg-fc-danger/10 hover:text-fc-danger'
    };

    const sizes: Record<Size, string> = {
        sm: 'h-8 px-3.5 text-fc-xs',
        md: 'h-9 px-4 text-fc-sm',
        lg: 'h-11 px-6 text-fc-md'
    };

    /*
     * `aria-disabled:*` mirrors the `disabled:*` pair because an <a> has no disabled state —
     * the attribute is advisory, so the pointer-events kill is what actually stops the
     * navigation. A <button> never matches these; a link never matches the native ones.
     */
    /* `rest` is declared button-shaped, so the anchor branch needs it re-cast — one component,
       two elements, and Svelte's handler props are invariant in their element type. */
    const anchorRest = $derived(rest as unknown as HTMLAnchorAttributes);

    const classes = $derived(twMerge('inline-flex shrink-0 items-center rounded-fc-pill justify-center gap-2 font-medium whitespace-nowrap transition-colors disabled:opacity-50 disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring', variants[variant], sizes[size], className));
</script>

{#snippet content()}
    {#if icon}
        <iconify-icon {icon} width={glyph} height={glyph} class="block shrink-0 {glyphClass[size]}"></iconify-icon>
    {/if}
    {#if children}{@render children()}{/if}
    {#if iconRight}
        <iconify-icon icon={iconRight} width={glyph} height={glyph} class="block shrink-0 {glyphClass[size]}"></iconify-icon>
    {/if}
{/snippet}

<!--
  An action that navigates is a link, and a link that looks like a button is still a link:
  it has to be middle-clickable, openable in a new tab and reachable from the status bar.
  Without `href` every call site rebuilt these classes on an <a> by hand — which is exactly
  how a design system leaks. `type` is dropped on the anchor branch: on an <a> it means
  content-type, not button behaviour.
-->
{#if href}
    <a
        href={disabled ? undefined : href}
        aria-disabled={disabled ? 'true' : undefined}
        tabindex={disabled ? -1 : undefined}
        class={classes}
        {...anchorRest}
    >
        {@render content()}
    </a>
{:else}
    <button {type} {disabled} class={classes} {...rest}>
        {@render content()}
    </button>
{/if}

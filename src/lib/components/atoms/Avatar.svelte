<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';

    export type Size = 'sm' | 'md' | 'lg';

    export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
        src?: string;
        alt?: string;
        name?: string;
        size?: Size;
        class?: string;

    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';

    let {
        src,
        alt,
        name = '',
        size = 'md',
        class: className = '',
        ...rest
    }: AvatarProps = $props();

    const sizes: Record<Size, string> = {
        sm: 'h-8 w-8 text-fc-xs',
        md: 'h-10 w-10 text-fc-sm',
        lg: 'h-14 w-14 text-fc-md'
    };

    const pixels: Record<Size, number> = { sm: 32, md: 40, lg: 56 };

    /* Falls back to `name` so the avatar is not silent: an empty alt marks the image
       decorative, which is only true when the caller gave us nothing to announce. */
    const label = $derived(alt ?? name);
    const initial = $derived(name ? name.trim().charAt(0).toUpperCase() : '?');

    /*
     * A broken `src` must fall back to the initial, and this is not optional polish: an <img>
     * that fails to load renders its `alt` text in place of the picture, and `alt` here is the
     * person's *name*. So a 404 avatar — an expired OIDC URL, a deleted upload, an offline
     * gravatar — turns the circle into a clipped word. That is exactly how it shipped: Vision's
     * mobile nav showed "yann" spilling out of a 32px pill.
     *
     * `failed` resets when `src` changes so a retry, or a different user in a reused component
     * instance, is not permanently stuck on the initial.
     */
    let failed = $state(false);
    $effect(() => {
        void src;
        failed = false;
    });
    /* `relative` contains the `sr-only` label — see the note in `Switch.svelte`. */
    const classes = $derived(twMerge('relative inline-flex shrink-0 items-center justify-center rounded-fc-pill bg-fc-accent text-fc-accent-fg font-semibold overflow-hidden', sizes[size], className));
</script>

<span class={classes} {...rest}>
    {#if src && !failed}
        <img
            {src}
            alt={label}
            width={pixels[size]}
            height={pixels[size]}
            loading="lazy"
            onerror={() => (failed = true)}
            class="h-full w-full object-cover"
        />
    {:else}
        <span aria-hidden="true">{initial}</span>
        {#if label}<span class="sr-only">{label}</span>{/if}
    {/if}
</span>

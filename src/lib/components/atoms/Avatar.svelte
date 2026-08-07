<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import { twMerge } from '../../utils/cn.js';

    type Size = 'sm' | 'md' | 'lg';

    let {
        src,
        alt,
        name = '',
        size = 'md',
        class: className = '',
        ...rest
    }: HTMLAttributes<HTMLSpanElement> & {
        src?: string;
        alt?: string;
        name?: string;
        size?: Size;
        class?: string;
    } = $props();

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
    const classes = $derived(twMerge('inline-flex shrink-0 items-center justify-center rounded-fc-pill bg-fc-accent text-fc-accent-fg font-semibold overflow-hidden', sizes[size], className));
</script>

<span class={classes} {...rest}>
    {#if src}
        <img
            {src}
            alt={label}
            width={pixels[size]}
            height={pixels[size]}
            loading="lazy"
            class="h-full w-full object-cover"
        />
    {:else}
        <span aria-hidden="true">{initial}</span>
        {#if label}<span class="sr-only">{label}</span>{/if}
    {/if}
</span>

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

    const label = $derived(alt ?? name);
    const initial = $derived(name ? name.trim().charAt(0).toUpperCase() : '?');

    let failed = $state(false);
    $effect(() => {
        void src;
        failed = false;
    });
    const classes = $derived(twMerge('relative inline-flex shrink-0 items-center justify-center rounded-fc-pill bg-fc-accent text-fc-accent-fg font-semibold overflow-hidden', sizes[size], className));
</script>

<!--
@component
L'image d'un membre, avec repli sur l'initiale quand elle échoue à charger — pas sur son texte alternatif.
-->

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

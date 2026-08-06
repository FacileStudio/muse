<script lang="ts">
    import { twMerge } from '../../utils/cn.js';

    type Size = 'sm' | 'md' | 'lg';

    let {
        src,
        alt = '',
        name = '',
        size = 'md',
        class: className = ''
    }: {
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

    const initial = $derived(name ? name.trim().charAt(0).toUpperCase() : '?');
    const classes = $derived(twMerge('inline-flex shrink-0 items-center justify-center rounded-fc-pill border border-fc-border bg-fc-accent text-fc-accent-fg font-semibold overflow-hidden', sizes[size], className));
</script>

<span class={classes}>
    {#if src}
        <img {src} {alt} class="h-full w-full object-cover" />
    {:else}
        <span aria-hidden="true">{initial}</span>
    {/if}
</span>

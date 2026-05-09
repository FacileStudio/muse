<script lang="ts">
    import type { Snippet } from 'svelte';
    import { gsap } from 'gsap';
    import { twMerge } from 'tailwind-merge';
    import { prefersReducedMotion } from '../../utils/motion.js';

    let {
        href,
        icon,
        label,
        active = false,
        collapsed = false,
        class: className = '',
        right,
        ...rest
    }: {
        href?: string;
        icon?: string;
        label?: string;
        active?: boolean;
        collapsed?: boolean;
        class?: string;
        right?: Snippet;
        [key: string]: unknown;
    } = $props();

    const classes = $derived(twMerge(
        'h-10 w-full flex items-center justify-between px-3 rounded-fc-md text-fc-sm transition-colors text-fc-fg border border-fc-fg/7 hover:bg-fc-fg/7',
        active && 'bg-fc-fg/10',
        className
    ));

    function press(e: PointerEvent) {
        if (prefersReducedMotion()) return;
        const el = e.currentTarget as HTMLElement;
        gsap.killTweensOf(el, 'scale');
        gsap.to(el, {
            scale: 0.97,
            duration: 0.08,
            ease: 'power2.in',
            onComplete: () => gsap.to(el, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
        });
    }
</script>

{#snippet inner()}
    {#if icon}<iconify-icon {icon} width="16" class="shrink-0 text-fc-fg/66"></iconify-icon>{/if}
    {#if !collapsed}
        <span class="flex items-center gap-1.5 shrink-0">
            {#if label}<span>{label}</span>{/if}
            {#if right}{@render right()}{/if}
        </span>
    {/if}
{/snippet}

{#if href}
    <a {href} class={classes} onpointerdown={press}>
        {@render inner()}
    </a>
{:else}
    <button type="button" class={classes} onpointerdown={press} {...rest}>
        {@render inner()}
    </button>
{/if}

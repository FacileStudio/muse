<script lang="ts">
    import type { Snippet } from 'svelte';
    import { gsap } from 'gsap';
    import { twMerge } from '../../utils/cn.js';
    import { prefersReducedMotion } from '../../utils/motion.js';
    import TextElevate from '../motion/TextElevate.svelte';

    let {
        href,
        icon,
        label,
        active = false,
        collapsed = false,
        textDelay = 0.15,
        class: className = '',
        right,
        ...rest
    }: {
        href?: string;
        icon?: string;
        label?: string;
        active?: boolean;
        collapsed?: boolean;
        textDelay?: number;
        class?: string;
        right?: Snippet;
        [key: string]: unknown;
    } = $props();

    const classes = $derived(twMerge(
        'flex items-center gap-2.5 rounded-fc-md text-fc-sm transition-colors overflow-hidden',
        collapsed
            ? 'size-fc-nav-item shrink-0 self-center justify-center gap-0 p-0'
            : 'w-full min-h-11 px-3 py-2.5',
        active ? 'bg-fc-accent text-fc-accent-fg font-medium' : 'text-fc-fg-muted hover:bg-fc-surface hover:text-fc-fg',
        className
    ));

    function springPress(node: HTMLElement) {
        function down() {
            if (prefersReducedMotion()) return;
            gsap.killTweensOf(node, 'scale');
            gsap.to(node, {
                scale: 0.94,
                duration: 0.08,
                ease: 'power2.in',
                onComplete: () => gsap.to(node, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
            });
        }
        node.addEventListener('pointerdown', down);
        return { destroy() { node.removeEventListener('pointerdown', down); } };
    }
</script>

{#snippet inner()}
    {#if icon}<iconify-icon {icon} width="18" height="18" class="block shrink-0"></iconify-icon>{/if}
    {#if !collapsed}
        <span class="flex flex-1 items-center justify-between gap-2 overflow-hidden">
            {#if label}<TextElevate text={label} visible={!collapsed} delay={textDelay} />{/if}
            {#if right}{@render right()}{/if}
        </span>
    {/if}
{/snippet}

{#if href}
    <a {href} class={classes} use:springPress>
        {@render inner()}
    </a>
{:else}
    <button type="button" class={classes} use:springPress {...rest}>
        {@render inner()}
    </button>
{/if}

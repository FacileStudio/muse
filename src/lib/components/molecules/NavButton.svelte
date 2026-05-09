<script lang="ts">
    import type { Snippet } from 'svelte';
    import { gsap } from 'gsap';
    import { twMerge } from 'tailwind-merge';
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
        'px-3 py-3 flex w-full items-center gap-2 rounded-fc-md transition-colors text-fc-fg border border-fc-fg/7 hover:bg-fc-fg/7 overflow-hidden',
        active && 'bg-fc-fg/7',
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
    {#if icon}<iconify-icon {icon} width="20" height="20" class="shrink-0 text-fc-fg/66"></iconify-icon>{/if}
    <span class="flex flex-1 items-center justify-between gap-2 text-fc-sm overflow-hidden">
        {#if label}<TextElevate text={label} visible={!collapsed} delay={textDelay} />{/if}
        {#if right}{@render right()}{/if}
    </span>
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

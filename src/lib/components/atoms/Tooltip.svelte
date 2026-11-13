<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';

    export interface TooltipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
        /** The hint. Short, plain text: it names or explains the control and never carries anything the page lacks. */
        text: string;
        /** Milliseconds a hover waits before the hint shows. Keyboard focus shows it at once, and so does a hover within 500ms of another tooltip. @default 300 */
        delay?: number;
        /** Wires the hint to the trigger with `aria-describedby`. Pass `false` when the trigger's accessible name already says it. @default true */
        describe?: boolean;
        disabled?: boolean;
        class?: string;
        /** The trigger. Its first element gets `aria-describedby`. */
        children: Snippet;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { consumeEscape } from '../../utils/handlers.js';
    import { floatingPanel } from '../../utils/control.js';
    import { AnchoredPopup, present } from '../../utils/popup.svelte.js';
    import { prefersReducedMotion } from '../../utils/motion.js';
    import { TOOLTIP_DELAY, TOOLTIP_GRACE, tooltips } from '../../utils/tooltip.js';
    import { fade } from 'svelte/transition';

    let {
        text,
        delay = TOOLTIP_DELAY,
        describe = true,
        disabled = false,
        class: className = '',
        children,
        ...rest
    }: TooltipProps = $props();

    const uid = $props.id();
    const tipId = `${uid}-tip`;
    let wrapper: HTMLElement | null = $state(null);
    let shown = $state(false);
    let timer: ReturnType<typeof setTimeout> | undefined;

    let tip: HTMLElement | null = $state(null);

    const trigger = () => (wrapper?.firstElementChild as HTMLElement | null) ?? wrapper;
    const geometry = new AnchoredPopup(trigger, 40, { width: () => tip?.offsetWidth ?? 160, align: () => 'auto' });
    const visible = $derived(shown && !disabled);

    function show() {
        clearTimeout(timer);
        if (disabled) return;
        tooltips.opened(hide);
        geometry.place();
        shown = true;
    }

    function hide() {
        clearTimeout(timer);
        if (!shown) return;
        shown = false;
        tooltips.closed(hide);
    }

    function enter(event: PointerEvent) {
        if (event.pointerType === 'touch' || disabled) return;
        clearTimeout(timer);
        if (shown) return;
        const wait = tooltips.delayFor(delay);
        if (wait > 0) timer = setTimeout(show, wait);
        else show();
    }

    function leavePointer() {
        clearTimeout(timer);
        timer = setTimeout(hide, TOOLTIP_GRACE);
    }

    function leaveFocus(event: FocusEvent) {
        const next = event.relatedTarget as Node | null;
        if (!next || !wrapper?.contains(next)) hide();
    }

    function focusin(event: FocusEvent) {
        if ((event.target as HTMLElement).matches(':focus-visible')) show();
    }

    $effect(() => {
        const target = wrapper?.firstElementChild;
        if (!target || disabled || !describe) return;
        const previous = target.getAttribute('aria-describedby');
        const ids = new Set(previous ? previous.split(/\s+/) : []);
        ids.add(tipId);
        target.setAttribute('aria-describedby', [...ids].join(' '));
        return () => {
            if (previous) target.setAttribute('aria-describedby', previous);
            else target.removeAttribute('aria-describedby');
        };
    });

    $effect(() => {
        if (!visible) return;
        const onKey = (event: KeyboardEvent) => {
            consumeEscape(event, shown, hide);
        };
        document.addEventListener('keydown', onKey, true);
        return () => document.removeEventListener('keydown', onKey, true);
    });

    $effect(() => {
        if (visible && tip) geometry.place();
    });

    $effect(() => {
        if (disabled) hide();
    });

    $effect(() => () => {
        clearTimeout(timer);
        tooltips.closed(hide);
    });
</script>

<!--
@component
Une info-bulle au survol et au focus clavier, pour nommer ou préciser un contrôle. Elle s'ouvre après 300ms de survol, tout de suite au clavier et tout de suite si une autre vient de se fermer. Une seule à la fois, rien au toucher. Échap la ferme, le pointeur peut passer dessus sans qu'elle disparaisse, et elle ne porte jamais seule une information : le contrôle garde son nom. Tout contrôle fait d'une icône seule en porte une ; jamais d'attribut `title` natif.
-->

<span
    bind:this={wrapper}
    class={twMerge('relative inline-flex', className)}
    onpointerenter={enter}
    onpointerleave={leavePointer}
    onpointerdown={hide}
    data-muse-tooltip
    onfocusin={focusin}
    onfocusout={leaveFocus}
    {...rest}
>
    {@render children()}

    {#if visible}
        <span
            bind:this={tip}
            id={tipId}
            popover="manual"
            role="tooltip"
            aria-hidden={describe ? undefined : 'true'}
            class={twMerge(floatingPanel, 'w-max max-w-[min(20rem,calc(100vw-1rem))] overflow-visible bg-fc-accent px-2.5 py-1.5 text-fc-xs text-fc-accent-fg')}
            style:left="{geometry.left}px"
            style:top={geometry.up ? 'auto' : `${geometry.top}px`}
            style:bottom={geometry.up ? `${geometry.bottom}px` : 'auto'}
            use:present
            transition:fade={{ duration: prefersReducedMotion() ? 0 : 120 }}
        >
            {text}
        </span>
    {/if}
</span>

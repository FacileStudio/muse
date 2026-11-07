<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';

    export interface TooltipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
        /** The hint. Short, plain text: it names or explains the control and never carries anything the page lacks. */
        text: string;
        /** Milliseconds a hover waits before the hint shows. Focus shows it at once. @default 500 */
        delay?: number;
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

    let { text, delay = 500, disabled = false, class: className = '', children, ...rest }: TooltipProps = $props();

    const uid = $props.id();
    const tipId = `${uid}-tip`;
    const GRACE_MS = 120;
    let wrapper: HTMLElement | null = $state(null);
    let shown = $state(false);
    let timer: ReturnType<typeof setTimeout> | undefined;

    let tip: HTMLElement | null = $state(null);

    const geometry = new AnchoredPopup(() => wrapper, 40, { width: () => tip?.offsetWidth ?? 160, align: () => 'auto' });
    const visible = $derived(shown && !disabled);

    function show() {
        clearTimeout(timer);
        geometry.place();
        shown = true;
    }

    function hide() {
        clearTimeout(timer);
        shown = false;
    }

    function enter(event: PointerEvent) {
        if (event.pointerType === 'touch') return;
        clearTimeout(timer);
        if (!shown) timer = setTimeout(show, delay);
    }

    function leavePointer() {
        clearTimeout(timer);
        timer = setTimeout(hide, GRACE_MS);
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
        if (!target || disabled) return;
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

    $effect(() => () => clearTimeout(timer));
</script>

<!--
@component
Une info-bulle au survol et au focus clavier, pour nommer ou préciser un contrôle. Échap la ferme, le pointeur peut passer dessus sans qu'elle disparaisse, et elle ne porte jamais seule une information : le contrôle garde son nom.
-->

<span
    bind:this={wrapper}
    class={twMerge('relative inline-flex', className)}
    onpointerenter={enter}
    onpointerleave={leavePointer}
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
            class={twMerge(floatingPanel, 'w-max max-w-[min(20rem,calc(100vw-1rem))] overflow-visible bg-fc-accent px-2.5 py-1.5 text-fc-xs text-fc-accent-fg')}
            style:left="{geometry.left}px"
            style:top={geometry.up ? 'auto' : `${geometry.top}px`}
            style:bottom={geometry.up ? `${geometry.bottom}px` : 'auto'}
            use:present
        >
            {text}
        </span>
    {/if}
</span>

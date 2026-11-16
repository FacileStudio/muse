<script module lang="ts">
    import type { BulleMood } from '../../utils/bulle.js';

    export interface BulleBlobProps {
        /** The assistant's name. The blob is drawn from it, so one name always gives the same blob. */
        name?: string;
        mood?: BulleMood;
        /** Blob width and height in px. */
        size?: number;
        class?: string;
    }
</script>

<script lang="ts">
    import '@facile/blob/motion.css';
    import '@facile/blob/gaze.css';
    import { Blob, gaze, happy, thinking } from '@facile/blob';
    import { MediaQuery } from 'svelte/reactivity';
    import { twMerge } from '../../utils/cn.js';
    import { bulleLook, bulleName } from '../../utils/bulle.js';

    let { name, mood = 'idle', size = 28, class: className = '' }: BulleBlobProps = $props();

    const reduced = new MediaQuery('(prefers-reduced-motion: reduce)');
    const look = $derived(bulleLook(mood, reduced.current));
    const eyes = $derived(reduced.current ? undefined : gaze({ travel: 4, target: 'pointer' }));
    const expression = $derived(look.face === 'happy' ? happy : look.face === 'thinking' ? thinking : undefined);
</script>

<!--
@component
Le blob de l'assistant, dessiné à partir de son nom, avec une humeur : il réfléchit, il est content, ou il est grisé quand l'assistant n'est pas disponible.
-->

<Blob
    {@attach eyes}
    name={bulleName(name)}
    {size}
    animate={look.animate ?? undefined}
    {expression}
    aria-hidden="true"
    class={twMerge('shrink-0', look.muted && 'opacity-50 grayscale', className)}
/>

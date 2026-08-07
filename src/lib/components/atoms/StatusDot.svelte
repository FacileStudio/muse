<script lang="ts">
    import { twMerge } from '../../utils/cn.js';

    type Tone = 'success' | 'danger' | 'warning' | 'muted' | 'accent';

    let {
        tone = 'muted',
        label,
        pulse = false,
        class: className = ''
    }: {
        tone?: Tone;
        label?: string;
        pulse?: boolean;
        class?: string;
    } = $props();

    const dots: Record<Tone, string> = {
        success: 'bg-fc-success',
        danger: 'bg-fc-danger',
        warning: 'bg-fc-warning',
        muted: 'bg-fc-fg-muted',
        accent: 'bg-fc-accent'
    };

    const classes = $derived(
        twMerge('inline-flex items-center gap-2 text-fc-sm text-fc-fg-muted', className)
    );
</script>

<span class={classes}>
    <span class="relative inline-flex size-2 shrink-0">
        {#if pulse}
            <span
                class={twMerge(
                    'absolute inset-0 animate-ping rounded-fc-pill opacity-60 motion-reduce:hidden',
                    dots[tone]
                )}
            ></span>
        {/if}
        <span class={twMerge('relative inline-flex size-2 rounded-fc-pill', dots[tone])}></span>
    </span>
    {#if label}<span>{label}</span>{/if}
</span>

<script lang="ts">
    import { twMerge } from 'tailwind-merge';

    type Size = 'sm' | 'md' | 'lg';

    let {
        size = 'md',
        class: className = ''
    }: { size?: Size; class?: string } = $props();

    const sizes: Record<Size, string> = {
        sm: 'h-4 w-4 border-2',
        md: 'h-6 w-6 border-2',
        lg: 'h-10 w-10 border-[3px]'
    };

    const classes = $derived(twMerge('inline-block rounded-full border-t-fc-accent animate-spin motion-reduce:animate-none', sizes[size], className));
</script>

<span role="status" aria-label="Loading" class={classes}></span>

<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import { twMerge } from '../../utils/cn.js';
    import { icons } from '../../icons.js';
    import IconButton from '../atoms/IconButton.svelte';
    import Spinner from '../atoms/Spinner.svelte';

    type Status = 'pending' | 'uploading' | 'done' | 'error';
    type Item = {
        id: string;
        name: string;
        size?: number;
        progress: number;
        status: Status;
        error?: string;
    };

    let {
        items,
        onCancel,
        onRetry,
        showTotal = true,
        class: className = '',
        ...rest
    }: HTMLAttributes<HTMLDivElement> & {
        items: Item[];
        onCancel?: (id: string) => void;
        onRetry?: (id: string) => void;
        showTotal?: boolean;
        class?: string;
    } = $props();

    const clamp = (value: number): number =>
        Number.isFinite(value) ? Math.min(100, Math.max(0, Math.round(value))) : 0;

    const formatBytes = (bytes?: number): string => {
        if (bytes === undefined || !Number.isFinite(bytes) || bytes < 0) return '';
        if (bytes < 1024) return `${Math.round(bytes)} B`;
        const units = ['KB', 'MB', 'GB', 'TB'];
        let value = bytes / 1024;
        let unit = 0;
        while (value >= 1024 && unit < units.length - 1) {
            value /= 1024;
            unit += 1;
        }
        return `${value >= 10 ? Math.round(value) : value.toFixed(1)} ${units[unit]}`;
    };

    const total = $derived(
        items.length === 0
            ? 0
            : clamp(items.reduce((sum, item) => sum + clamp(item.progress), 0) / items.length)
    );
    const doneCount = $derived(items.filter((item) => item.status === 'done').length);

    const statusText = (item: Item): string => {
        if (item.status === 'uploading') return `${clamp(item.progress)}%`;
        if (item.status === 'done') return 'Done';
        if (item.status === 'error') return 'Failed';
        return 'Waiting';
    };

    const meta = (item: Item): string =>
        [formatBytes(item.size), statusText(item)].filter(Boolean).join(' · ');

    const rowTone = (status: Status): string =>
        status === 'error' ? 'border-fc-danger/40 bg-fc-danger/10' : 'border-fc-border bg-fc-bg';

    const classes = $derived(twMerge('flex w-full flex-col gap-2', className));
</script>

{#if items.length > 0}
    <div class={classes} {...rest}>
        <ul class="flex flex-col gap-2">
            {#each items as item (item.id)}
                <li class={twMerge('rounded-fc-md border p-3', rowTone(item.status))}>
                    <div class="flex items-center gap-3">
                        <span class="flex size-5 shrink-0 items-center justify-center">
                            {#if item.status === 'uploading'}
                                <Spinner size="sm" />
                            {:else if item.status === 'done'}
                                <span class="text-fc-success">
                                    <iconify-icon icon={icons.check} width="18" height="18" class="block"
                                    ></iconify-icon>
                                </span>
                            {:else if item.status === 'error'}
                                <span class="text-fc-danger">
                                    <iconify-icon
                                        icon={icons.warning}
                                        width="18"
                                        height="18"
                                        class="block"
                                    ></iconify-icon>
                                </span>
                            {:else}
                                <span class="text-fc-fg-muted">
                                    <iconify-icon
                                        icon={icons.clock}
                                        width="18"
                                        height="18"
                                        class="block"
                                    ></iconify-icon>
                                </span>
                            {/if}
                        </span>

                        <div class="min-w-0 flex-1">
                            <p class="truncate text-fc-sm text-fc-fg">{item.name}</p>
                            <p class="text-fc-xs text-fc-fg-muted">{meta(item)}</p>
                        </div>

                        {#if onRetry && item.status === 'error'}
                            <IconButton
                                type="button"
                                aria-label={`Retry ${item.name}`}
                                class="border-transparent text-fc-fg-muted hover:text-fc-fg"
                                onclick={() => onRetry?.(item.id)}
                            >
                                <iconify-icon icon={icons.refresh} width="18" height="18" class="block"
                                ></iconify-icon>
                            </IconButton>
                        {/if}

                        {#if onCancel}
                            <IconButton
                                type="button"
                                aria-label={`Remove ${item.name}`}
                                class="border-transparent text-fc-fg-muted hover:text-fc-fg"
                                onclick={() => onCancel?.(item.id)}
                            >
                                <iconify-icon icon={icons.close} width="18" height="18" class="block"></iconify-icon>
                            </IconButton>
                        {/if}
                    </div>

                    <div
                        class="mt-2 h-1.5 w-full overflow-hidden rounded-fc-pill bg-fc-surface"
                        role="progressbar"
                        aria-label={`Upload progress for ${item.name}`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={item.status === 'pending' ? undefined : clamp(item.progress)}
                    >
                        <div
                            class="h-full rounded-fc-pill bg-fc-accent transition-[width] duration-300 motion-reduce:transition-none"
                            style:width="{item.status === 'pending' ? 0 : clamp(item.progress)}%"
                        ></div>
                    </div>

                    {#if item.status === 'error' && item.error}
                        <p class="mt-2 text-fc-xs text-fc-danger">{item.error}</p>
                    {/if}
                </li>
            {/each}
        </ul>

        {#if showTotal}
            <div class="flex flex-col gap-1.5 pt-1">
                <div class="flex items-baseline justify-between gap-3 text-fc-xs text-fc-fg-muted">
                    <span>{doneCount} of {items.length} complete</span>
                    <span>{total}%</span>
                </div>
                <div
                    class="h-1.5 w-full overflow-hidden rounded-fc-pill bg-fc-surface"
                    role="progressbar"
                    aria-label="Total upload progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={total}
                >
                    <div
                        class="h-full rounded-fc-pill bg-fc-accent transition-[width] duration-300 motion-reduce:transition-none"
                        style:width="{total}%"
                    ></div>
                </div>
            </div>
        {/if}
    </div>
{/if}

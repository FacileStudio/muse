<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLLabelAttributes } from 'svelte/elements';

    export type Rejection = { file: File; reason: Reason };

    export type Reason = 'type' | 'size' | 'count';

    export interface DropzoneProps extends HTMLLabelAttributes {
        files?: File[];
        accept?: string;
        multiple?: boolean;
        maxSize?: number;
        maxFiles?: number;
        disabled?: boolean;
        label?: string;
        hint?: string;
        onFiles?: (files: File[]) => void;
        onReject?: (rejections: Rejection[]) => void;
        children?: Snippet;
        class?: string;

    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import { icons } from '../../icons.js';

    let {
        files = $bindable<File[]>([]),
        accept,
        multiple = false,
        maxSize,
        maxFiles,
        disabled = false,
        label = 'Drop files here',
        hint,
        onFiles,
        onReject,
        children,
        class: className = '',
        ...rest
    }: DropzoneProps = $props();

    let depth = $state(0);
    const dragging = $derived(depth > 0 && !disabled);

    const matchesAccept = (file: File): boolean => {
        if (!accept) return true;
        const patterns = accept
            .split(',')
            .map((pattern) => pattern.trim().toLowerCase())
            .filter(Boolean);
        if (patterns.length === 0) return true;
        const type = file.type.toLowerCase();
        const name = file.name.toLowerCase();
        return patterns.some((pattern) => {
            if (pattern.startsWith('.')) return name.endsWith(pattern);
            if (pattern.endsWith('/*')) return type.startsWith(pattern.slice(0, -1));
            return type === pattern;
        });
    };

    const intake = (incoming: File[]) => {
        if (disabled || incoming.length === 0) return;

        const accepted: File[] = [];
        const rejected: Rejection[] = [];
        const held = multiple ? files.length : 0;
        const limit = multiple ? (maxFiles ?? Infinity) : 1;

        for (const file of incoming) {
            if (!matchesAccept(file)) {
                rejected.push({ file, reason: 'type' });
            } else if (maxSize !== undefined && file.size > maxSize) {
                rejected.push({ file, reason: 'size' });
            } else if (held + accepted.length >= limit) {
                rejected.push({ file, reason: 'count' });
            } else {
                accepted.push(file);
            }
        }

        if (accepted.length > 0) {
            files = multiple ? [...files, ...accepted] : accepted;
            onFiles?.(accepted);
        }
        if (rejected.length > 0) onReject?.(rejected);
    };

    const handleChange = (event: Event) => {
        const input = event.currentTarget as HTMLInputElement;
        if (input.files) intake(Array.from(input.files));
        input.value = '';
    };

    /* dragenter/dragleave bubble from every child element, so a boolean flickers
       as the pointer crosses them; the depth counter only settles back at zero
       once the pointer has actually left the zone. */
    const handleEnter = () => {
        depth += 1;
    };

    const handleLeave = () => {
        depth = Math.max(0, depth - 1);
    };

    /* A drag that ends outside the window never sends the balancing dragleave, so without
       this the zone stays lit until the next full drag cycle. */
    const handleEnd = () => {
        depth = 0;
    };

    $effect(() => {
        if (disabled) depth = 0;
    });

    const handleOver = (event: DragEvent) => {
        event.preventDefault();
        if (event.dataTransfer) event.dataTransfer.dropEffect = disabled ? 'none' : 'copy';
    };

    const handleDrop = (event: DragEvent) => {
        event.preventDefault();
        depth = 0;
        if (disabled) return;
        const dropped = event.dataTransfer?.files;
        if (dropped && dropped.length > 0) intake(Array.from(dropped));
    };

    const classes = $derived(
        twMerge(
            'relative flex min-h-[140px] w-full flex-col items-center justify-center gap-2 rounded-fc-md border border-dashed border-fc-border bg-fc-bg p-6 text-center text-fc-fg transition-colors motion-reduce:transition-none has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-fc-ring',
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-fc-surface',
            dragging ? 'border-fc-accent bg-fc-surface' : '',
            className
        )
    );
</script>

<label
    class={classes}
    data-dragging={dragging ? 'true' : undefined}
    aria-disabled={disabled ? 'true' : undefined}
    {...rest}
    ondragenter={handleEnter}
    ondragleave={handleLeave}
    ondragend={handleEnd}
    ondragover={handleOver}
    ondrop={handleDrop}
>
    <input
        type="file"
        class="sr-only"
        {accept}
        {multiple}
        {disabled}
        aria-label={hint ? `${label}. ${hint}` : label}
        onchange={handleChange}
    />

    {#if children}
        {@render children()}
    {:else}
        <span class="text-fc-fg-muted">
            <iconify-icon icon={icons.upload} width="28" height="28" class="block"></iconify-icon>
        </span>
        <span class="text-fc-sm font-medium">{label}</span>
        {#if hint}<span class="text-fc-xs text-fc-fg-muted">{hint}</span>{/if}
        <span
            class="mt-1 inline-flex h-11 items-center justify-center gap-2 rounded-fc-pill border border-fc-border px-4 text-fc-sm"
        >
            <iconify-icon icon={icons.folder} width="16" height="16" class="block"></iconify-icon>
            Browse
        </span>
    {/if}

    <span class="sr-only" aria-live="polite">{dragging ? 'Release to add files' : ''}</span>
</label>

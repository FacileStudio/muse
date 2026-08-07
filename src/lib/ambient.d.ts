/**
 * `<iconify-icon>` is a custom element the consumer registers, not a dependency of
 * this library, so Svelte has no intrinsic definition for it. Declaring it here is
 * what lets `svelte-check` type the rest of a template instead of bailing on the
 * first unknown tag.
 */
declare namespace svelteHTML {
    interface IntrinsicElements {
        'iconify-icon': {
            icon?: string;
            width?: string | number;
            height?: string | number;
            class?: string;
            mode?: string;
            inline?: boolean;
            'aria-hidden'?: 'true' | 'false' | boolean;
            'aria-label'?: string;
        };
    }
}

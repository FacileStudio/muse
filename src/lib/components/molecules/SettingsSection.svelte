<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';

    export interface SettingsSectionProps extends HTMLAttributes<HTMLElement> {
        title?: string;
        description?: string;
        actions?: Snippet;
        bare?: boolean;
        bodyClass?: string;
        class?: string;
        children?: Snippet;

    }
</script>

<script lang="ts">
    import Section from '../layout/Section.svelte';

    /*
     * The settings preset of `Section`: same anatomy, card on by default, because a settings
     * block is a surface holding `SettingsRow`s. Everything structural lives in `Section` — this
     * exists so the nine repos already importing it keep working, and so CHARTE §14's settings
     * shape has a name that says what it is for.
     *
     * Reach for `Section` for anything that is not a settings block.
     */

    let {
        bare = false,
        children,
        ...rest
    }: SettingsSectionProps = $props();
</script>

<!-- `children` is forwarded as a prop, not as slot content: wrapping it in a snippet here would
     hand `Section` a defined-but-empty one, and a titles-only section would grow an empty body
     div it never had. -->
<Section card={!bare} {children} {...rest} />

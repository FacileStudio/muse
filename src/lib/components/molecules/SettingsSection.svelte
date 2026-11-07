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

    let {
        bare = false,
        children,
        ...rest
    }: SettingsSectionProps = $props();
</script>

<!--
@component
Un bloc de réglages. C'est `Section` avec la carte activée par défaut, parce qu'un bloc de réglages est une surface qui porte des lignes.
-->

<!-- `children` is forwarded as a prop, not as slot content: wrapping it in a snippet here would
     hand `Section` a defined-but-empty one, and a titles-only section would grow an empty body
     div it never had. -->
<Section card={!bare} {children} {...rest} />

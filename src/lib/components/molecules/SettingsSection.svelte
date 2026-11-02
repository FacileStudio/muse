<script module lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';

    export interface SettingsSectionProps extends HTMLAttributes<HTMLElement> {
        title?: string;
        description?: string;
        actions?: Snippet;
        bodyClass?: string;
        class?: string;
        children?: Snippet;

    }
</script>

<script lang="ts">
    import Section from '../layout/Section.svelte';

    /* No card: a settings block holds fields, and a field is already a surface. */
    let { children, ...rest }: SettingsSectionProps = $props();
</script>

<!--
@component
Un bloc de réglages : titre, description et lignes, sans carte autour, parce que chaque champ porte déjà sa surface.
-->

<!-- `children` is forwarded as a prop, not as slot content: wrapping it in a snippet here would
     hand `Section` a defined-but-empty one, and a titles-only section would grow an empty body
     div it never had. -->
<Section {children} {...rest} />

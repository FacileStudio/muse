<script module lang="ts">
    import type { IdeaSource } from '../../utils/ideas.js';

    export interface IdeaLinksProps {
        /** The sources of an idea. A source with a safe `href` is a link; any other is plain text. */
        sources: IdeaSource[];
        label: string;
    }
</script>

<script lang="ts">
    import { isSafeHref } from '../../utils/href.js';

    let { sources, label }: IdeaLinksProps = $props();

    const chip =
        'inline-flex max-w-full items-center rounded-fc-pill bg-fc-surface px-2.5 py-0.5 text-fc-xs font-medium whitespace-nowrap text-fc-fg-muted';
    const link =
        'relative transition-colors hover:text-fc-fg after:absolute after:inset-x-0 after:-inset-y-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring';
</script>

<!--
@component
Les sources d'une idée en pastilles : un lien quand l'adresse est sûre, du texte sinon. Interne à IdeaCard.
-->

<ul class="flex flex-wrap gap-x-2 gap-y-3" aria-label={label}>
    {#each sources as source, index (index)}
        <li class="max-w-full">
            {#if isSafeHref(source.href)}
                <a href={source.href} class={`${chip} ${link}`}><span class="min-w-0 truncate">{source.label}</span></a>
            {:else}
                <span class={chip}><span class="min-w-0 truncate">{source.label}</span></span>
            {/if}
        </li>
    {/each}
</ul>

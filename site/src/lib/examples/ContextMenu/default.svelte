<script lang="ts">
    import { ContextMenu, icons, toast, type MenuEntry } from '@facile/muse';

    const files = ['Contrat.pdf', 'Devis.pdf', 'Notes.md'];

    function entries(target: Element): MenuEntry[] {
        const name = target.closest<HTMLElement>('[data-file]')?.dataset.file;
        if (!name) return [];
        return [
            { label: 'Ouvrir', onselect: () => toast.info(name), icon: icons.eye },
            { label: 'Renommer', onselect: () => toast.info(`Renommer ${name}`), icon: icons.edit },
            { separator: true },
            { label: 'Supprimer', onselect: () => toast.info(`${name} supprimé`), icon: icons.remove, tone: 'danger' }
        ];
    }
</script>

<ContextMenu label="Actions du fichier" items={entries}>
    <ul class="flex flex-col gap-1">
        {#each files as file (file)}
            <li data-file={file} tabindex="0" class="rounded-fc-sm bg-fc-component px-3 py-2 text-fc-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring">
                {file}
            </li>
        {/each}
    </ul>
</ContextMenu>

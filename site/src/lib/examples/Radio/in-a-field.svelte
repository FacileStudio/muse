<script lang="ts">
    import { Field, Radio } from '@facile/muse';

    let arrondi = $state('15');
</script>

<Field label="Arrondi des entrées de temps" helper="Appliqué à l'enregistrement de chaque entrée.">
    <div class="flex flex-col gap-2">
        <Radio name="arrondi" value="1" label="À la minute" bind:group={arrondi} />
        <Radio name="arrondi" value="15" label="Au quart d'heure" bind:group={arrondi} />
        <Radio name="arrondi" value="60" label="À l'heure" bind:group={arrondi} />
    </div>
</Field>

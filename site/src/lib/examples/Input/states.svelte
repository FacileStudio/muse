<script lang="ts">
    import { Field, Input } from '@facile/muse';
</script>

<div class="flex flex-col gap-4">
    <Field label="Espace" helper="Défini à la création, non modifiable.">
        <Input value="studio" readonly disabled />
    </Field>
    <Field label="Sous-domaine" error="Ce sous-domaine est déjà utilisé.">
        <Input value="studio" />
    </Field>
</div>

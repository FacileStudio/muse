<script lang="ts">
    import { Field, TagInput } from '@facile/muse';

    let to = $state(['lea@example.com']);
    const isEmail = (tag: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tag);
</script>

<Field label="Destinataires">
    <TagInput bind:value={to} validate={isEmail} placeholder="Adresse e-mail" />
</Field>

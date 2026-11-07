<script lang="ts">
    import { RadioGroup } from '@facile/muse';
</script>

<RadioGroup
    aria-label="Densité"
    orientation="horizontal"
    value="m"
    options={[
        { value: 's', label: 'Compacte' },
        { value: 'm', label: 'Normale' },
        { value: 'l', label: 'Large' }
    ]}
/>

<script lang="ts">
    import { Button, Field, Popover, Select, Stack } from '@facile/muse';

    let open = $state(false);
</script>

<Popover label="Filtres" bind:open>
    <Stack>
        <Field label="Formule">
            <Select
                value="pro"
                options={[
                    { value: 'pro', label: 'Pro' },
                    { value: 'team', label: 'Équipe' }
                ]}
            />
        </Field>
        <Button size="sm" onclick={() => (open = false)}>Appliquer</Button>
    </Stack>
</Popover>

<script lang="ts">
    import { Button, Inline, Stack, Stepper } from '@facile/muse';

    const steps = [{ label: 'Compte' }, { label: 'Profil' }, { label: 'Équipe' }, { label: 'Terminé' }];
    let current = $state(1);
</script>

<Stack>
    <Stepper {steps} {current} onSelect={(index) => (current = index)} />
    <Inline>
        <Button variant="secondary" size="sm" disabled={current === 0} onclick={() => (current -= 1)}>Précédent</Button>
        <Button size="sm" disabled={current === steps.length - 1} onclick={() => (current += 1)}>Suivant</Button>
    </Inline>
</Stack>

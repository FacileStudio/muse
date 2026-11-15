<script lang="ts">
    import { StepNav } from '@facile/muse';

    let step = $state(1);
</script>

<StepNav primary="Continuer" canBack={step > 0} canSkip onContinue={() => (step += 1)} onBack={() => (step -= 1)} onSkip={() => (step += 1)} />

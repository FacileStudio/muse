<script lang="ts">
    import { StatusDot } from '@facile/muse';

    let enCours = $state(true);
</script>

<StatusDot
    tone={enCours ? 'accent' : 'neutral'}
    pulse={enCours}
    label={enCours ? 'Suivi en cours — Refonte du portail' : 'Suivi arrêté'}
/>

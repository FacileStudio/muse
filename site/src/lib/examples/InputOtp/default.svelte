<script lang="ts">
    import { Field, InputOtp } from '@facile/muse';

    let code = $state('');
</script>

<Field label="Code à six chiffres">
    <InputOtp bind:value={code} onComplete={(valeur) => console.log(valeur)} />
</Field>

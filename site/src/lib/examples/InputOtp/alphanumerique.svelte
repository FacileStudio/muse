<script lang="ts">
    import { Field, InputOtp } from '@facile/muse';
</script>

<Field label="Code d’invitation" error="Ce code a expiré.">
    <InputOtp length={4} kind="alphanumeric" value="A1B" />
</Field>

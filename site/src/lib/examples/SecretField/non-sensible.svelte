<script lang="ts">
    import { SecretField } from '@facile/muse';
</script>

<SecretField
    sensitive={false}
    label="URL de l'instance Pool"
    value="wss://pool.facile.studio/v1/events"
    helper="Identifiant machine : rien à masquer, mais tout à copier."
/>

<script lang="ts">
    import { Switch } from '@facile/muse';

    let notifications = $state(true);
</script>

<Switch label="Notifications par e-mail" bind:checked={notifications} />

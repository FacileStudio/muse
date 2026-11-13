<script lang="ts">
    import { Presence } from '@facile/muse';

    const peers = [
        { id: 1, name: 'Léa Martin', color: '#AD9EF0' },
        { id: 2, name: 'Marc Dubois', color: '#EE7E89' },
        { id: 3, name: 'Inès Haddad', color: '#7EEEDB' }
    ];
</script>

<Presence {peers} />

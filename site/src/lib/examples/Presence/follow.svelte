<script lang="ts">
    import { Presence } from '@facile/muse';
    import type { PresenceId } from '@facile/muse';

    const peers = [
        { id: 1, name: 'Léa Martin', color: '#AD9EF0' },
        { id: 2, name: 'Marc Dubois', color: '#EE7E89' },
        { id: 3, name: 'Inès Haddad', color: '#7EEEDB' },
        { id: 4, name: 'Paul Girard', color: '#EEB47E' },
        { id: 5, name: 'Zoé Laurent', color: '#A9EE7E' },
        { id: 6, name: 'Noé Petit', color: '#F09ED6' }
    ];

    let following = $state<PresenceId | null>(2);
</script>

<Presence {peers} {following} onfollow={(id) => (following = id)} />

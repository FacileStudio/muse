/** Names the client that asked for a pending action: Bulle, the host of a client URL, else the raw id. */
export function pendingClientName(clientId: string): string {
    if (clientId === 'bulle') return 'Bulle';
    try {
        return new URL(clientId).host;
    } catch {
        return clientId || '?';
    }
}

export type PendingState = 'ready' | 'changed' | 'missing';

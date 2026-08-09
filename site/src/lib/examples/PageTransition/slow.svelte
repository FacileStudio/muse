<script lang="ts">
    import { Button, Card, PageTransition, Stack } from '@facile/muse';

    const invoices = [
        { ref: 'F-2026-0184', client: 'Heranova', amount: '4 250 € HT' },
        { ref: 'F-2026-0185', client: 'LPB', amount: '1 800 € HT' },
        { ref: 'F-2026-0186', client: 'Studio Facile', amount: '960 € HT' }
    ];

    let index = $state(0);
    const invoice = $derived(invoices[index]);
</script>

<Stack gap="tight">
    <Button variant="outline" size="sm" onclick={() => (index = (index + 1) % invoices.length)}>
        Facture suivante
    </Button>

    <PageTransition key={invoice.ref} duration={0.6} distance={24}>
        <Card>
            <p class="text-fc-sm font-medium text-fc-fg">{invoice.ref}</p>
            <p class="text-fc-xs text-fc-fg-muted">{invoice.client} · {invoice.amount}</p>
        </Card>
    </PageTransition>
</Stack>

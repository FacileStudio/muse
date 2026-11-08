import type { ApprovalRequest, Idea } from '@facile/muse';

export function sampleApproval(id: string): ApprovalRequest {
    return {
        id: `approval-${id}`,
        tool: 'courrier.send_draft',
        summary: 'Envoyer la réponse à Claire Martin, objet « Devis du 12 novembre ».',
        args: { to: 'claire@martin.example', subject: 'Devis du 12 novembre', attachments: 1 }
    };
}

export function ideaFixtures(): Idea[] {
    return [
        {
            id: 'mail',
            kind: 'mail',
            title: 'Répondre à Claire Martin sur le devis',
            why: 'Son e-mail attend depuis trois jours et mentionne une date limite vendredi.',
            draft: 'Bonjour Claire,\n\nMerci pour votre message. Le devis est validé de notre côté, je vous renvoie la version signée aujourd\'hui.\n\nBien cordialement,\nCamille',
            sources: [
                { label: 'E-mail de Claire Martin', href: '/#/ideas' },
                { label: 'Devis du 12 novembre', href: '/#/ideas' }
            ]
        },
        {
            id: 'task',
            kind: 'task',
            title: 'Créer les tâches de la réunion de mardi',
            why: 'Cinq actions ressortent des notes, aucune n\'est encore assignée.',
            sources: [{ label: 'Notes du mardi' }]
        },
        {
            id: 'event',
            kind: 'event',
            title: 'Bloquer une heure pour la revue du budget',
            why: 'Deux invitations se chevauchent jeudi après-midi.',
            run: { state: 'running' }
        },
        {
            id: 'approval',
            kind: 'follow_up',
            title: 'Relancer le prospect Atelier Lumière',
            why: 'Aucune réponse depuis quatorze jours.',
            draft: 'Bonjour, je me permets de revenir vers vous au sujet de notre échange du 25 octobre.',
            run: { state: 'needs_approval', approval: sampleApproval('approval') },
            continueHref: '/#/ideas'
        },
        {
            id: 'done',
            kind: 'research',
            title: 'Comparer trois fournisseurs de papier recyclé',
            why: 'Le dernier devis dépasse le budget de 18 %.',
            run: {
                state: 'done',
                summary: 'Trois fournisseurs comparés, le moins cher livre en cinq jours.',
                outputs: [
                    { label: 'Tableau comparatif', href: '/#/ideas' },
                    { label: 'Tâche de relance', href: '/#/ideas' }
                ]
            },
            continueHref: '/#/ideas'
        },
        {
            id: 'failed',
            kind: 'other',
            title: 'Archiver les factures de l\'an dernier',
            why: 'Quarante-deux factures traînent dans la boîte de réception.',
            run: { state: 'failed', error: 'Le dossier d\'archive est introuvable.' }
        },
        {
            id: 'custom',
            kind: 'lead_signal',
            kindLabel: 'Prospect',
            icon: 'solar:compass-linear',
            title: 'Un concurrent vient de baisser ses prix',
            why: 'Son offre Pro passe de 49 à 39 euros par mois depuis lundi.'
        }
    ];
}

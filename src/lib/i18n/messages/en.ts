import type { Message } from '../translate.js';

export const en = {
    'auth.newHere': 'New to Facile?',
    'auth.createAccount': 'Create your account',
    'chart.empty': 'No data',
    'chart.category': 'Category',
    'chart.label': 'Label',
    'chart.point': 'Point',
    'chart.slice': 'Slice',
    'chart.value': 'Value',
    'chart.share': 'Share',
    'chart.lineSummary': {
        one: 'Line chart across {count} point: {names}',
        other: 'Line chart across {count} points: {names}'
    },
    'chart.barSummary': {
        one: 'Bar chart across {count} category: {names}',
        other: 'Bar chart across {count} categories: {names}'
    },
    'chart.stackedBarSummary': {
        one: 'Stacked bar chart across {count} category: {names}',
        other: 'Stacked bar chart across {count} categories: {names}'
    },
    'chart.donutSummary': {
        one: 'Donut chart of {count} slice totalling {total}: {parts}',
        other: 'Donut chart of {count} slices totalling {total}: {parts}'
    },
    'chart.sparklineSummary': {
        one: 'Sparkline of {count} value, from {first} to {last}',
        other: 'Sparkline of {count} values, from {first} to {last}'
    },
    'colorPicker.pick': 'Pick a colour',
    'colorPicker.presets': 'Colour presets',
    'confirm.confirm': 'Confirm',
    'confirm.cancel': 'Cancel',
    'dialog.close': 'Close',
    'dropzone.label': 'Drop your files here',
    'dropzone.browse': 'Browse',
    'dropzone.release': 'Release to add the files',
    'legal.nav': 'Legal',
    'legal.cgu': 'Terms of use',
    'legal.cgv': 'Terms of sale',
    'legal.privacy': 'Privacy',
    'legal.legalNotice': 'Legal notice',
    'locale.label': 'Language',
    'mobileNav.profile': 'Profile',
    'pageHeader.back': 'Back',
    'planLimit.title': "You've reached your plan's limit",
    'planLimit.cta': 'See plans',
    'planLimit.dismiss': 'Not now',
    'planLimit.limit': 'Limit: {limit}',
    'secret.notSet': 'Not set',
    'secret.reveal': 'Reveal',
    'secret.hide': 'Hide',
    'secret.revealLabel': 'Reveal secret',
    'secret.hideLabel': 'Hide secret',
    'secret.copy': 'Copy',
    'secret.copyLabel': 'Copy to clipboard',
    'secret.copySecretLabel': 'Copy secret to clipboard',
    'secret.revealed': 'Secret revealed',
    'secret.hidden': 'Secret hidden',
    'secret.hiddenAgain': 'Secret hidden again',
    'secret.copied': 'Copied to clipboard',
    'secret.copyFailed': 'Could not copy. Reveal it and copy by hand',
    'sideBar.search': 'Search',
    'sideBar.collapse': 'Collapse',
    'sideBar.expand': 'Expand',
    'signIn.label': 'Sign in with Facile',
    'signIn.loading': 'Signing in…',
    'spaceSwitcher.personal': 'Personal',
    'spaceSwitcher.manage': 'Manage spaces',
    'spinner.loading': 'Loading',
    'tabs.label': 'Sections',
    'toast.dismiss': 'Dismiss notification',
    'upload.total': 'Total upload progress',
    'upload.progressFor': 'Upload progress for {name}',
    'upload.complete': {
        one: '{count} of {total} complete',
        other: '{count} of {total} complete'
    },
    'upload.done': 'Done',
    'upload.failed': 'Failed',
    'upload.waiting': 'Waiting',
    'upload.retry': 'Retry {name}',
    'upload.remove': 'Remove {name}',
    'download.title': 'Download the apps',
    'download.platforms': 'Available for {platforms}',
    'pricing.title': 'Plans',
    'pricing.interval': 'Billing period',
    'pricing.monthly': 'Monthly',
    'pricing.yearly': 'Yearly',
    'pricing.saveUpTo': 'Save up to {percent}',
    'pricing.save': 'Save {percent}',
    'pricing.perMonth': '/ month',
    'pricing.perYear': '/ year',
    'pricing.billedYearly': '{amount} a month, billed yearly',
    'pricing.free': 'Free',
    'pricing.choose': 'Choose {name}',
    'pricing.startFree': 'Start for free',
    'pricing.includes': 'Included in {name}',
    'feature.storage': {
        one: '{count} GB of storage',
        other: '{count} GB of storage'
    },
    'feature.storageUnlimited': 'Unlimited storage',
    'feature.mailboxes': {
        one: '{count} mailbox',
        other: '{count} mailboxes'
    },
    'feature.mailboxesUnlimited': 'Unlimited mailboxes',
    'feature.callMinutes': {
        one: 'Calls up to {count} minute',
        other: 'Calls up to {count} minutes'
    },
    'feature.callMinutesUnlimited': 'Calls with no time limit',
    'feature.participants': {
        one: 'Up to {count} participant per call',
        other: 'Up to {count} participants per call'
    },
    'feature.participantsUnlimited': 'Unlimited participants per call',
    'feature.recording': 'Call recording',
    'feature.glouton': 'Access to Glouton'
} satisfies Record<string, Message>;

export type MuseMessages = { [K in keyof typeof en]: Message };

export type MuseKey = keyof typeof en;

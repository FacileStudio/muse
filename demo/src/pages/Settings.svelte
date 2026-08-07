<script lang="ts">
    import {
        Alert,
        Button,
        Card,
        ColorPicker,
        ConfirmModal,
        Dropzone,
        Field,
        Input,
        ProfileCard,
        Radio,
        Select,
        Switch,
        UploadProgress,
        icons
    } from '@facile/lib';

    type Upload = {
        id: string;
        name: string;
        size?: number;
        progress: number;
        status: 'pending' | 'uploading' | 'done' | 'error';
        error?: string;
    };

    let displayName = $state('Camille');
    let accountEmail = $state('camille@facile.studio');
    let identityColor = $state('#AD9EF0');
    let language = $state('en');
    let timezone = $state('Europe/Paris');

    let accountSaving = $state(false);
    let accountSaved = $state(false);
    let accountTimer: ReturnType<typeof setTimeout> | undefined;

    let emailNotifications = $state(true);
    let weeklyDigest = $state(false);
    let compactMode = $state(true);

    let rateType = $state('daily');
    let dailyRate = $state<string | number>(520);
    let hourlyRate = $state<string | number>(65);
    let workdayHours = $state<string | number>(8);

    let rateSaving = $state(false);
    let rateSaved = $state(false);
    let rateTimer: ReturnType<typeof setTimeout> | undefined;

    let avatarUploads = $state<Upload[]>([]);
    let avatarError = $state('');
    let avatarSeq = 0;

    let deleteOpen = $state(false);
    let deleteScheduled = $state(false);

    const rateSummary = $derived(rateType === 'daily' ? `€${dailyRate} / day` : `€${hourlyRate} / h`);

    const rejectionText: Record<string, string> = {
        type: 'that file is not an image',
        size: 'that file is larger than 2 MB',
        count: 'only one avatar at a time'
    };

    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    function saveAccount() {
        accountSaving = true;
        accountSaved = false;
        clearTimeout(accountTimer);
        setTimeout(() => {
            accountSaving = false;
            accountSaved = true;
            accountTimer = setTimeout(() => (accountSaved = false), 4000);
        }, 700);
    }

    function saveRate() {
        rateSaving = true;
        rateSaved = false;
        clearTimeout(rateTimer);
        setTimeout(() => {
            rateSaving = false;
            rateSaved = true;
            rateTimer = setTimeout(() => (rateSaved = false), 4000);
        }, 700);
    }

    function uploadAvatar(files: File[]) {
        const file = files[0];
        if (!file) return;
        avatarError = '';
        const id = `avatar-${++avatarSeq}`;
        avatarUploads = [{ id, name: file.name, size: file.size, progress: 0, status: 'pending' }];
        const timer = setInterval(() => {
            const item = avatarUploads.find((u) => u.id === id);
            if (!item) {
                clearInterval(timer);
                return;
            }
            item.status = 'uploading';
            item.progress = Math.min(100, item.progress + 15);
            if (item.progress < 100) return;
            clearInterval(timer);
            item.status = 'done';
        }, 180);
    }

    async function deleteAccount() {
        await wait(1200);
        deleteScheduled = true;
    }
</script>

<div class="flex flex-col gap-10">
    <div class="flex flex-col gap-2">
        <h1 class="text-fc-2xl font-semibold text-fc-fg">Settings</h1>
        <p class="text-fc-sm text-fc-fg-muted">
            Your identity, preferences and billing rate for this workspace.
        </p>
    </div>

    <section class="flex flex-col gap-4">
        <h2 class="text-fc-lg font-semibold text-fc-fg">Profile</h2>
        <ProfileCard
            name={displayName}
            email={accountEmail}
            role="owner"
            color={identityColor}
            meta={[
                { label: rateType === 'daily' ? 'Daily rate' : 'Hourly rate', value: rateSummary },
                { label: 'Member since', value: 'March 2024' }
            ]}
        >
            {#snippet actions()}
                <Button variant="outline" size="sm" icon={icons.edit}>Edit profile</Button>
            {/snippet}
            <div class="flex flex-col gap-2">
                <span class="text-fc-sm font-medium text-fc-fg">Identity colour</span>
                <p class="text-fc-xs text-fc-fg-muted">
                    Used for your avatar dot and your entries across the suite.
                </p>
                <ColorPicker bind:value={identityColor} showLabels class="mt-1" />
            </div>
        </ProfileCard>
    </section>

    <section class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
            <h2 class="text-fc-lg font-semibold text-fc-fg">Account</h2>
            <p class="text-fc-sm text-fc-fg-muted">
                How you appear to everyone else in Acme Studio.
            </p>
        </div>

        <Card class="flex flex-col gap-4">
            <div class="grid gap-4 sm:grid-cols-2">
                <Field label="Display name" helper="Shown on entries, comments and invoices.">
                    <Input bind:value={displayName} maxlength={80} placeholder="Camille" />
                </Field>
                <Field label="Email" helper="Managed by Facile SSO — change it at porte.facile.studio.">
                    <Input value={accountEmail} type="email" disabled />
                </Field>
                <Field label="Language">
                    <Select bind:value={language}>
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                    </Select>
                </Field>
                <Field label="Timezone" helper="Timers and reports are stamped in this zone.">
                    <Select bind:value={timezone}>
                        <option value="Europe/Paris">Europe / Paris</option>
                        <option value="Europe/London">Europe / London</option>
                        <option value="America/New_York">America / New York</option>
                        <option value="UTC">UTC</option>
                    </Select>
                </Field>
            </div>

            {#if accountSaved}
                <Alert tone="success">Account details saved.</Alert>
            {/if}

            <Button
                size="lg"
                icon={icons.edit}
                class="self-start"
                disabled={accountSaving}
                onclick={saveAccount}
            >
                {accountSaving ? 'Saving…' : 'Save changes'}
            </Button>
        </Card>
    </section>

    <section class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
            <h2 class="text-fc-lg font-semibold text-fc-fg">Preferences</h2>
            <p class="text-fc-sm text-fc-fg-muted">Applied to this browser and every device you sign in from.</p>
        </div>

        <Card class="flex flex-col gap-5">
            <div class="flex flex-col gap-1.5">
                <Switch bind:checked={emailNotifications} label="Email notifications" class="font-medium" />
                <p class="pl-14 text-fc-xs text-fc-fg-muted">
                    Mentions, invitations and anything assigned to you.
                </p>
            </div>
            <div class="flex flex-col gap-1.5">
                <Switch bind:checked={weeklyDigest} label="Weekly digest" class="font-medium" />
                <p class="pl-14 text-fc-xs text-fc-fg-muted">
                    One Monday summary of tracked hours and open invoices.
                </p>
            </div>
            <div class="flex flex-col gap-1.5">
                <Switch bind:checked={compactMode} label="Compact mode" class="font-medium" />
                <p class="pl-14 text-fc-xs text-fc-fg-muted">
                    Tighter rows and smaller cards — more on screen, less breathing room.
                </p>
            </div>
        </Card>
    </section>

    <section class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
            <h2 class="text-fc-lg font-semibold text-fc-fg">Billable rate</h2>
            <p class="text-fc-sm text-fc-fg-muted">
                Used to turn your tracked time into a value. Never shown to clients.
            </p>
        </div>

        <Card class="flex flex-col gap-4">
            <div class="flex flex-col gap-2 sm:flex-row">
                <Radio
                    bind:group={rateType}
                    value="daily"
                    name="rate-type"
                    label="Daily rate"
                    class="min-h-11 flex-1 rounded-fc-md border border-fc-border px-3"
                />
                <Radio
                    bind:group={rateType}
                    value="hourly"
                    name="rate-type"
                    label="Hourly rate"
                    class="min-h-11 flex-1 rounded-fc-md border border-fc-border px-3"
                />
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
                {#if rateType === 'daily'}
                    <Field label="Daily rate (€ / day)" helper="Earnings = (tracked hours ÷ workday hours) × daily rate.">
                        <Input bind:value={dailyRate} type="number" min="0" step="10" placeholder="520" />
                    </Field>
                    <Field label="Workday duration (hours)" helper="How long a full billable day runs.">
                        <Input bind:value={workdayHours} type="number" min="1" max="24" step="0.5" placeholder="8" />
                    </Field>
                {:else}
                    <Field label="Hourly rate (€ / h)" helper="Applied directly to your tracked hours.">
                        <Input bind:value={hourlyRate} type="number" min="0" step="5" placeholder="65" />
                    </Field>
                {/if}
            </div>

            {#if rateSaved}
                <Alert tone="success">Rate saved — {rateSummary}.</Alert>
            {/if}

            <Button
                size="lg"
                icon={icons.edit}
                class="self-start"
                disabled={rateSaving}
                onclick={saveRate}
            >
                {rateSaving ? 'Saving…' : 'Save rate'}
            </Button>
        </Card>
    </section>

    <section class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
            <h2 class="text-fc-lg font-semibold text-fc-fg">Avatar</h2>
            <p class="text-fc-sm text-fc-fg-muted">
                Replaces the initial in the sidebar. Square images crop best.
            </p>
        </div>

        <Dropzone
            accept="image/*"
            maxSize={2 * 1024 * 1024}
            label="Drop a picture here"
            hint="PNG, JPG or WebP — up to 2 MB"
            onFiles={uploadAvatar}
            onReject={(rejections) =>
                (avatarError = rejectionText[rejections[0].reason] ?? 'that file was rejected')}
        />

        {#if avatarError}
            <p class="text-fc-xs text-fc-danger">Not uploaded — {avatarError}.</p>
        {/if}

        {#if avatarUploads.length > 0}
            <UploadProgress
                items={avatarUploads}
                showTotal={false}
                onCancel={() => (avatarUploads = [])}
            />
        {/if}
    </section>

    <section class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
            <h2 class="text-fc-lg font-semibold text-fc-fg">Danger zone</h2>
            <p class="text-fc-sm text-fc-fg-muted">Irreversible, and nobody can undo it for you.</p>
        </div>

        <Card class="flex flex-col gap-4">
            <div class="flex flex-col gap-1">
                <p class="text-fc-sm font-medium text-fc-fg">Delete this account</p>
                <p class="text-fc-xs text-fc-fg-muted">
                    Removes you from every space and deletes your tracked time, invoices and files.
                </p>
            </div>
            <Button
                variant="danger"
                size="lg"
                icon={icons.remove}
                class="self-start"
                onclick={() => (deleteOpen = true)}
            >
                Delete account
            </Button>
            {#if deleteScheduled}
                <Alert tone="danger">
                    Deletion scheduled. You have 30 days to sign back in and cancel it.
                </Alert>
            {/if}
        </Card>
    </section>

    <ConfirmModal
        bind:open={deleteOpen}
        tone="danger"
        title="Delete your account?"
        description="Every space loses your entries, and your invoices go with them. This cannot be undone."
        confirmLabel="Delete account"
        cancelLabel="Keep my account"
        onconfirm={deleteAccount}
    />
</div>

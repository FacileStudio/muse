<script lang="ts">
    import {
        Alert,
        Button,
        SwatchPicker,
        Dropzone,
        Field,
        icons,
        Input,
        OptionCards,
        ProfileCard,
        SettingsRow,
        SettingsSection,
        Stack,
        UploadProgress
    } from '@facile/muse';

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

    let saving = $state(false);
    let saved = $state(false);
    let savedTimer: ReturnType<typeof setTimeout> | undefined;

    let rateType = $state('daily');
    let dailyRate = $state<string | number>(520);
    let hourlyRate = $state<string | number>(65);
    let workdayHours = $state<string | number>(8);

    let avatarUploads = $state<Upload[]>([]);
    let avatarError = $state('');
    let avatarSeq = 0;

    const rateSummary = $derived(rateType === 'daily' ? `€${dailyRate} / day` : `€${hourlyRate} / h`);

    const rateBases = [
        { value: 'daily', label: 'Per day', icon: icons.calendar },
        { value: 'hourly', label: 'Per hour', icon: icons.clock }
    ];

    const rejectionText: Record<string, string> = {
        type: 'that file is not an image',
        size: 'that file is larger than 2 MB',
        count: 'only one avatar at a time'
    };

    function save() {
        saving = true;
        saved = false;
        clearTimeout(savedTimer);
        setTimeout(() => {
            saving = false;
            saved = true;
            savedTimer = setTimeout(() => (saved = false), 4000);
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
</script>

<Stack gap="section">
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
        <div class="flex flex-col gap-2">
            <span class="text-fc-sm font-medium text-fc-fg">Identity colour</span>
            <p class="text-fc-xs text-fc-fg-muted">
                Used for your avatar dot and your entries across the suite.
            </p>
            <SwatchPicker bind:value={identityColor} showLabels class="mt-1" />
        </div>
    </ProfileCard>

    <SettingsSection
        title="Account"
        description="How you appear to everyone else in Acme Studio."
    >
        <div class="grid gap-4 sm:grid-cols-2">
            <Field label="Display name" helper="Shown on entries, comments and invoices.">
                <Input bind:value={displayName} maxlength={80} placeholder="Camille" />
            </Field>
            <Field
                label="Email"
                helper="Managed by Facile SSO — change it at porte.facile.studio."
            >
                <Input value={accountEmail} type="email" disabled />
            </Field>
        </div>

        {#if saved}
            <Alert tone="success">Account details saved.</Alert>
        {/if}

        <Button
            size="lg"
            icon={icons.edit}
            class="self-start"
            disabled={saving}
            onclick={save}
        >
            {saving ? 'Saving…' : 'Save changes'}
        </Button>
    </SettingsSection>

    <SettingsSection
        title="Avatar"
        description="Replaces the initial in the sidebar. Square images crop best."
        bare
    >
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
    </SettingsSection>

    <SettingsSection
        title="Billable rate"
        description="Used to turn your tracked time into a value. Never shown to clients."
    >
        <SettingsRow label="Rate basis" description="Bill by the day or by the hour." stacked>
            <OptionCards
                options={rateBases}
                bind:value={rateType}
                name="rate-type"
                label="Rate basis"
            />
        </SettingsRow>

        <SettingsRow
            label={rateType === 'daily' ? 'Daily rate' : 'Hourly rate'}
            description={rateType === 'daily'
                ? 'Earnings = (tracked hours ÷ workday hours) × daily rate.'
                : 'Applied directly to your tracked hours.'}
        >
            {#if rateType === 'daily'}
                <Input bind:value={dailyRate} type="number" min="0" step="10" class="w-32" />
            {:else}
                <Input bind:value={hourlyRate} type="number" min="0" step="5" class="w-32" />
            {/if}
        </SettingsRow>

        {#if rateType === 'daily'}
            <SettingsRow
                label="Workday duration"
                description="How long a full billable day runs, in hours."
            >
                <Input bind:value={workdayHours} type="number" min="1" max="24" step="0.5" class="w-32" />
            </SettingsRow>
        {/if}
    </SettingsSection>

    <SettingsSection
        title="Session"
        description="Signed in through Facile SSO at porte.facile.studio."
    >
        <SettingsRow
            label="Log out"
            description="Ends this session on this device. Your other devices stay signed in."
        >
            <Button variant="outline" icon={icons.logout}>Log out</Button>
        </SettingsRow>
    </SettingsSection>
</Stack>

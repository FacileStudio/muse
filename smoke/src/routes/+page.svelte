<script lang="ts">
	/*
	 * One route, one of each tier. This is a contract harness, not a second demo: it exists so
	 * that resolving, compiling, server-rendering and style-scanning the *installed package*
	 * are proven, and it deliberately holds no design opinions of its own. Add a component
	 * here when a new tier or a new consumer-visible mechanism appears — not for coverage.
	 */
	import {
		Alert,
		Avatar,
		Badge,
		BarChart,
		Button,
		Card,
		Checkbox,
		DonutChart,
		Field,
		Input,
		LineChart,
		MobileNav,
		PageTransition,
		SecretField,
		SideBar,
		Sparkline,
		StatCard,
		Table,
		Tabs,
		icons
	} from '@facile/muse';

	let collapsed = $state(false);
	let digest = $state(true);
	let section = $state('overview');
	let name = $state('');

	const pages = [
		{ label: 'Overview', href: '/', icon: icons.dashboard, active: true },
		{ label: 'Reports', href: '/', icon: icons.folder }
	];

	const user = { name: 'Smoke' };

	const series = [{ name: 'Visits', data: [12, 18, 9, 24, 30, 21, 27] }];
	const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	const slices = [
		{ label: 'Desktop', value: 62 },
		{ label: 'Mobile', value: 31 },
		{ label: 'Tablet', value: 7 }
	];
</script>

<div class="flex h-dvh w-full overflow-hidden bg-fc-page" data-smoke="ready">
	<div class="hidden h-full shrink-0 p-3 md:block">
		<SideBar
			icon="solar:pallete-2-bold-duotone"
			title="Smoke"
			bind:collapsed
			{pages}
			{user}
			userHref="/"
			class="h-full"
		/>
	</div>

	<main class="min-w-0 flex-1 overflow-auto overscroll-contain pb-28 md:pb-0">
		<div class="mx-auto flex max-w-fc-lg flex-col gap-10 px-6 py-10">
			<PageTransition key={section}>
				<div class="flex flex-col gap-10">
					<section class="flex flex-col gap-4">
						<div class="flex flex-wrap items-center gap-3">
							<Button icon={icons.plus}>Action</Button>
							<Button href="/" variant="outline" iconRight={icons.arrow}>Link button</Button>
							<Badge tone="success">Live</Badge>
							<!-- A src that cannot resolve: the fallback must show the initial rather than
							     paint the alt text, which is what shipped broken once. -->
							<Avatar name="Smoke" src="/does-not-exist.png" />
						</div>
						<Alert tone="info" title="Installed from a tarball">
							Everything on this page came through node_modules, not a source alias.
						</Alert>
					</section>

					<section class="grid gap-4 sm:grid-cols-3">
						<StatCard label="Visits" value="1 054" delta="+12%">
							<Sparkline data={series[0].data} class="mt-2" showLast />
						</StatCard>
						<StatCard label="Signups" value="87" />
						<StatCard label="Errors" value="0" />
					</section>

					<section class="grid gap-4 lg:grid-cols-2">
						<Card class="flex flex-col gap-4">
							<p class="text-fc-sm font-medium text-fc-fg">Line</p>
							<LineChart {series} {labels} area />
						</Card>
						<Card class="flex flex-col gap-4">
							<p class="text-fc-sm font-medium text-fc-fg">Bar</p>
							<BarChart {series} {labels} />
						</Card>
						<Card class="flex flex-col gap-4">
							<p class="text-fc-sm font-medium text-fc-fg">Donut</p>
							<DonutChart data={slices} class="flex-1" />
						</Card>
						<!-- Card as a link: proves the anchor branch and the `group` hover wiring. -->
						<Card href="/" class="flex flex-col gap-4">
							<span class="text-fc-sm font-medium text-fc-fg">Card that navigates</span>
							<span class="text-fc-xs text-fc-fg-muted transition-transform group-hover:translate-x-0.5">
								Follow →
							</span>
						</Card>
					</section>

					<section class="flex flex-col gap-4">
						<Tabs
							bind:value={section}
							items={[
								{ id: 'overview', label: 'Overview', icon: icons.dashboard },
								{ id: 'keys', label: 'Keys', icon: icons.key }
							]}
						/>
						<Card class="flex flex-col gap-4">
							<Field label="Name" helper="Wired through Field's context.">
								{#snippet children()}
									<Input bind:value={name} placeholder="Camille" />
								{/snippet}
							</Field>

							<!-- The self-labelling controls. Through v0.5.0 these ignored Field's
							     context, so the label rendered `for` pointing at nothing and the
							     control had no accessible name. smoke.sh checks the two ids match. -->
							<Field label="Send me a digest" helper="Checkbox adopting the field id.">
								{#snippet children()}
									<Checkbox bind:checked={digest} />
								{/snippet}
							</Field>
							<SecretField value="fc_rw_9f3c2ab1d4e5" label="API key" />
						</Card>
					</section>

					<section class="flex flex-col gap-4">
						<Table>
							<thead>
								<tr>
									<th scope="col">Route</th>
									<th scope="col">Visits</th>
								</tr>
							</thead>
							<tbody>
								{#each labels as label, i (i)}
									<tr>
										<td>/{label.toLowerCase()}</td>
										<td class="tabular-nums">{series[0].data[i]}</td>
									</tr>
								{/each}
							</tbody>
						</Table>
					</section>
				</div>
			</PageTransition>
		</div>
	</main>

	<MobileNav items={pages} {user} profileHref="/" />
</div>

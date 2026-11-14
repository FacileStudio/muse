<script lang="ts">
	import {
		DownloadSection,
		LandingFooter,
		LandingHeader,
		MobileNav,
		Page,
		PageHeader,
		Section,
		SettingsLayout,
		SideBar,
		Table,
		Tabs,
		Button,
		icons
	} from '@facile/muse';

	const LONG = 'Reconciliation-of-quarterly-invoices-across-every-workspace-and-every-currency';
	const URL_TEXT = 'https://facile.studio/very/long/path/that/never/breaks/because/it/has/no/spaces/at/all';
	const groups = ['Workspace', 'Billing and invoices', 'Administration'];

	const pages = Array.from({ length: 18 }, (_, i) => ({
		label: `Destination with a long name ${i + 1}`,
		href: `/overflow/${i + 1}`,
		icon: icons.folder,
		group: groups[Math.floor(i / 6)],
		active: i === 16
	}));

	const mobile = pages.slice(0, 6).map((page, i) => ({ ...page, active: i === 0 }));
	const user = { name: 'Camille Delacroix-Montgolfier', email: 'camille.delacroix-montgolfier@example.com' };

	let spaces = $state<{ id: string; name: string }[]>([]);
	const SPACE = 'Late workspace';

	$effect(() => {
		const timer = setTimeout(() => (spaces = [{ id: 'late', name: SPACE }]), 600);
		return () => clearTimeout(timer);
	});

	let narrowTab = $state('gear');
	const narrowTabs = [
		{ id: 'info', label: 'Infos salle', icon: icons.info },
		{ id: 'trips', label: 'Trajets', icon: icons.folder, badge: 2 },
		{ id: 'gear', label: 'Matos', icon: icons.folder, badge: 1 }
	];

	let tab = $state('t0');
	const tabs = Array.from({ length: 9 }, (_, i) => ({ id: `t${i}`, label: `Section ${i + 1} label`, badge: i * 7 }));

	const sections = ['profile', 'security', 'notifications', 'billing', 'integrations'].map((id) => ({
		id,
		label: `${id} ${LONG}`,
		icon: icons.folder,
		href: `/overflow?s=${id}`
	}));

	const columns = ['Product', 'Company', 'Resources', 'Legal'].map((title) => ({
		title,
		links: [
			{ href: '/a', label: `${title} ${LONG}` },
			{ href: '/b', label: 'Short' }
		]
	}));

	type Offender = { tag: string; cls: string; left: number; right: number };
	type Report = { width: number; scrollWidth: number; offenders: Offender[]; sidebar: string; tabs: string[] };

	let report = $state<Report | null>(null);

	function clipped(el: Element, width: number): boolean {
		for (let node = el.parentElement; node && node !== document.body; node = node.parentElement) {
			if (getComputedStyle(node).overflowX === 'visible') continue;
			const rect = node.getBoundingClientRect();
			if (rect.right <= width + 0.5 && rect.left >= -0.5) return true;
		}
		return false;
	}

	function sidebarState(): string {
		const active = document.querySelector<HTMLElement>('[data-probe-sidebar] nav [aria-current="page"]');
		if (!active || active.offsetParent === null) return 'hidden';
		let scroller = active.parentElement;
		while (scroller && getComputedStyle(scroller).overflowY !== 'auto') scroller = scroller.parentElement;
		if (!scroller) return 'no-scroller';
		if (scroller.scrollHeight <= scroller.clientHeight) return 'fits';
		const view = scroller.getBoundingClientRect();
		const item = active.getBoundingClientRect();
		const page = document.scrollingElement?.scrollTop ?? 0;
		if (page !== 0) return `page-scrolled-${page}`;
		if (!headerVisible()) return 'header-hidden';
		return item.top >= view.top && item.bottom <= view.bottom ? 'revealed' : 'below-fold';
	}

	function headerVisible(): boolean {
		const rail = document.querySelector('[data-probe-sidebar]');
		if (!rail) return false;
		const walker = document.createTreeWalker(rail, NodeFilter.SHOW_TEXT);
		const range = document.createRange();
		for (let node = walker.nextNode(); node; node = walker.nextNode()) {
			if (node.textContent?.trim() !== SPACE) continue;
			range.selectNodeContents(node);
			const text = range.getBoundingClientRect();
			for (let el = node.parentElement; el && el !== rail; el = el.parentElement) {
				if (getComputedStyle(el).overflowY === 'visible') continue;
				const box = el.getBoundingClientRect();
				if (text.top < box.top - 0.5 || text.bottom > box.bottom + 0.5) return false;
			}
			return true;
		}
		return false;
	}

	function tabRows(): string[] {
		return [...document.querySelectorAll<HTMLElement>('[data-probe-tabs] [role="tablist"]')].map((row) => {
			const active = row.querySelector('[aria-selected="true"], [aria-current="page"]');
			if (!active) return 'no-active-tab';
			const box = row.getBoundingClientRect();
			const tab = active.getBoundingClientRect();
			if (tab.left < box.left - 0.5 || tab.right > box.right + 0.5) return 'active-clipped';
			const hides = row.scrollWidth > row.clientWidth + 1;
			const mask = getComputedStyle(row).maskImage || getComputedStyle(row).getPropertyValue('-webkit-mask-image');
			if (hides && (!mask || mask === 'none')) return 'clipped-without-fade';
			return hides ? 'scrolls' : 'fits';
		});
	}

	function measure(): Report {
		const width = document.documentElement.clientWidth;
		const offenders: Offender[] = [];
		for (const el of document.querySelectorAll('[data-probe] *')) {
			const rect = el.getBoundingClientRect();
			if (rect.width <= 1 || rect.height <= 1) continue;
			if (rect.right <= width + 0.5 && rect.left >= -0.5) continue;
			if (clipped(el, width)) continue;
			offenders.push({
				tag: el.tagName.toLowerCase(),
				cls: (el.getAttribute('class') ?? '').slice(0, 120),
				left: Math.round(rect.left),
				right: Math.round(rect.right)
			});
		}
		const walker = document.createTreeWalker(document.querySelector('[data-probe]') ?? document.body, NodeFilter.SHOW_TEXT);
		const range = document.createRange();
		for (let node = walker.nextNode(); node; node = walker.nextNode()) {
			const parent = node.parentElement;
			if (!parent || !node.textContent?.trim()) continue;
			range.selectNodeContents(node);
			const rect = range.getBoundingClientRect();
			if (rect.width <= 1 || (rect.right <= width + 0.5 && rect.left >= -0.5)) continue;
			if (clipped(node as Element, width) || getComputedStyle(parent).overflowX !== 'visible') continue;
			offenders.push({
				tag: `text in ${parent.tagName.toLowerCase()}`,
				cls: (parent.getAttribute('class') ?? '').slice(0, 120),
				left: Math.round(rect.left),
				right: Math.round(rect.right)
			});
		}
		return {
			width,
			scrollWidth: document.documentElement.scrollWidth,
			offenders: offenders.slice(0, 20),
			sidebar: sidebarState(),
			tabs: tabRows()
		};
	}

	$effect(() => {
		const timer = setTimeout(() => {
			report = measure();
			window.parent.postMessage({ overflowProbe: $state.snapshot(report) }, '*');
		}, 1500);
		return () => clearTimeout(timer);
	});
</script>

<div data-probe class="bg-fc-page">
	<LandingHeader
		appName="Supercalifragilisticexpialidocious Studio"
		links={[1, 2, 3, 4, 5].map((i) => ({ href: `#l${i}`, label: `Navigation link ${i}`, active: i === 1 }))}
	/>

	<div class="flex w-full">
		<div class="sticky top-0 hidden h-dvh shrink-0 p-3 md:block" data-probe-sidebar>
			<SideBar
				icon={icons.folder}
				title={LONG}
				{pages}
				{user}
				{spaces}
				activeSpaceId="late"
				userHref="/"
				showSearch
				onSearch={() => {}}
				class="h-full"
			/>
		</div>

		<main class="min-w-0 flex-1 pb-28 md:pb-0">
			<Page>
				<PageHeader title={LONG} description={URL_TEXT} back={{ href: '/', label: LONG }}>
					{#snippet actions()}
						<Button icon={icons.plus}>Create a new invoice</Button>
						<Button variant="secondary">Export everything</Button>
					{/snippet}
				</PageHeader>

				<Section title={LONG} description={URL_TEXT} card>
					{#snippet actions()}
						<Button variant="secondary">Filter the list</Button>
					{/snippet}
					<p class="text-fc-sm text-fc-fg">{URL_TEXT}</p>
				</Section>

				<div data-probe-tabs class="flex flex-col gap-4">
					<Tabs bind:value={tab} items={tabs} />
					<div class="w-full max-w-80">
						<Tabs bind:value={narrowTab} items={narrowTabs} />
					</div>
				</div>

				<Table>
					<thead>
						<tr>
							{#each Array.from({ length: 8 }, (_, i) => i) as i (i)}
								<th scope="col">Column heading {i}</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						<tr>
							{#each Array.from({ length: 8 }, (_, i) => i) as i (i)}
								<td class="whitespace-nowrap">{LONG}</td>
							{/each}
						</tr>
					</tbody>
				</Table>

				<SettingsLayout {sections} active="security" backHref="/overflow" title={LONG} description={URL_TEXT}>
					{#snippet children(current)}
						<Section title={`${current} ${LONG}`} description={URL_TEXT} card>
							<p class="text-fc-sm text-fc-fg">{URL_TEXT}</p>
						</Section>
					{/snippet}
				</SettingsLayout>

				<DownloadSection
					platform="linux"
					downloads={[
						{ platform: 'linux', href: '/a.deb', label: `.deb ${LONG}`, size: 4_200_000 },
						{ platform: 'macos', href: '/a.dmg', label: '.dmg', size: 9_100_000 },
						{ platform: 'windows', href: '/a.msi', label: '.msi', size: 8_000_000 },
						{ platform: 'android', href: '/a.apk', label: '.apk', size: 3_000_000 }
					]}
					commands={[{ label: LONG, command: `curl -fsSL ${URL_TEXT}/install.sh | sh` }]}
					releasesHref="https://github.com/FacileStudio/muse/releases"
					checksumsHref="https://github.com/FacileStudio/muse/releases"
				/>
			</Page>
		</main>
	</div>

	<LandingFooter appName={LONG} tagline={URL_TEXT} {columns} year={2026} />

	<MobileNav items={mobile} {user} profileHref="/" />
</div>

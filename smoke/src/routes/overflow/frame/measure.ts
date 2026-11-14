export type Offender = { tag: string; cls: string; left: number; right: number };
export type Report = { width: number; scrollWidth: number; offenders: Offender[]; sidebar: string; tabs: string[] };

function clipped(el: Element, width: number): boolean {
	for (let node = el.parentElement; node && node !== document.body; node = node.parentElement) {
		if (getComputedStyle(node).overflowX === 'visible') continue;
		const rect = node.getBoundingClientRect();
		if (rect.right <= width + 0.5 && rect.left >= -0.5) return true;
	}
	return false;
}

function sidebarState(space: string): string {
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
	if (!headerVisible(space)) return 'header-hidden';
	return item.top >= view.top && item.bottom <= view.bottom ? 'revealed' : 'below-fold';
}

function headerVisible(space: string): boolean {
	const rail = document.querySelector('[data-probe-sidebar]');
	if (!rail) return false;
	const walker = document.createTreeWalker(rail, NodeFilter.SHOW_TEXT);
	const range = document.createRange();
	for (let node = walker.nextNode(); node; node = walker.nextNode()) {
		if (node.textContent?.trim() !== space) continue;
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

function faded(el: Element): boolean {
	const style = getComputedStyle(el);
	const mask = style.maskImage || style.getPropertyValue('-webkit-mask-image');
	return Boolean(mask) && mask !== 'none';
}

function tabRows(): string[] {
	const tables = [...document.querySelectorAll('[data-probe] table')].map((table) => {
		const scroller = table.parentElement;
		if (!scroller || scroller.scrollWidth <= scroller.clientWidth + 1) return 'fits';
		return faded(scroller) ? 'scrolls' : 'table-without-fade';
	});
	return tables.concat([...document.querySelectorAll<HTMLElement>('[data-probe-tabs] [role="tablist"]')].map((row) => {
		const active = row.querySelector('[aria-selected="true"], [aria-current="page"]');
		if (!active) return 'no-active-tab';
		const box = row.getBoundingClientRect();
		const tab = active.getBoundingClientRect();
		if (tab.left < box.left - 0.5 || tab.right > box.right + 0.5) return 'active-clipped';
		const hides = row.scrollWidth > row.clientWidth + 1;
		if (hides && !faded(row)) return 'clipped-without-fade';
		return hides ? 'scrolls' : 'fits';
	}));
}

/** Measures the probe page: overflow, the SideBar's active row and header, tab rows and tables. */
export function measure(space: string): Report {
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
		sidebar: sidebarState(space),
		tabs: tabRows()
	};
}

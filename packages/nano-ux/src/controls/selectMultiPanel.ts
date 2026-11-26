type PositionSelectMultiPanelParams = {
	panel: HTMLDialogElement;
	trigger: HTMLButtonElement;
	controls: HTMLDivElement;
	listbox: HTMLDivElement;
	rows: HTMLDivElement;
};

export const selectMultiMaxPopoverRows = 8;

export const positionSelectMultiPanel = ({
	panel,
	trigger,
	controls,
	listbox,
	rows,
}: PositionSelectMultiPanelParams) => {
	const {
		width,
		height,
		offsetLeft: left,
		offsetTop: top,
	} = window.visualViewport ?? {
		width: document.documentElement.clientWidth,
		height: document.documentElement.clientHeight,
		offsetLeft: 0,
		offsetTop: 0,
	};

	if (panel.hasAttribute("data-fullscreen")) {
		panel.style.width = `${width}px`;
		panel.style.left = `${left}px`;
		panel.style.top = `${top}px`;
		panel.style.height = `${height}px`;
		panel.style.maxHeight = `${height}px`;
		listbox.style.maxHeight = "";
		return;
	}

	const margin = 8;
	const anchor = trigger.getBoundingClientRect();
	const panelWidth = Math.min(anchor.width, Math.max(0, width - 2 * margin));

	panel.style.width = `${panelWidth}px`;

	const firstRow = rows.firstElementChild;
	const rowHeight = firstRow ? firstRow.getBoundingClientRect().height : 0;

	const listHeight =
		Math.min(rows.childElementCount, selectMultiMaxPopoverRows) * rowHeight;

	listbox.style.maxHeight = `${listHeight}px`;

	const style = window.getComputedStyle(panel);

	const chromeHeight =
		controls.getBoundingClientRect().height +
		Number.parseFloat(style.paddingTop) +
		Number.parseFloat(style.paddingBottom) +
		Number.parseFloat(style.borderTopWidth) +
		Number.parseFloat(style.borderBottomWidth);

	const desiredHeight = chromeHeight + listHeight;
	const belowStart = Math.max(top + margin, anchor.bottom + margin);
	const aboveEnd = Math.min(top + height - margin, anchor.top - margin);
	const below = Math.max(0, top + height - margin - belowStart);
	const above = Math.max(0, aboveEnd - top - margin);
	const openBelow = below >= desiredHeight;

	const availableHeight = openBelow
		? below
		: Math.max(above, chromeHeight + rowHeight);

	const panelHeight = Math.min(
		desiredHeight,
		availableHeight,
		Math.max(0, height - 2 * margin),
	);

	const x = Math.max(
		left + margin,
		Math.min(anchor.left, left + width - margin - panelWidth),
	);

	const y = openBelow
		? belowStart
		: Math.max(top + margin, aboveEnd - panelHeight);

	panel.style.left = `${x}px`;
	panel.style.top = `${y}px`;
	panel.style.height = "";
	panel.style.maxHeight = `${panelHeight}px`;
};

export const hideSelectMultiPanel = (panel: HTMLDialogElement) => {
	if (panel.open) panel.close();
	else if (panel.matches(":popover-open")) panel.hidePopover();
};

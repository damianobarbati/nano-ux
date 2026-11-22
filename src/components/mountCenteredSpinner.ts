type CenteredSpinnerMount = { anchor: HTMLElement; parent: HTMLElement };

export const mountCenteredSpinner = ({
	anchor,
	parent,
}: CenteredSpinnerMount) => {
	const doc = parent.ownerDocument;
	const win = doc.defaultView;
	if (!win) return;

	const ancestors: HTMLElement[] = [];

	for (let node: HTMLElement | null = parent; node; node = node.parentElement) {
		ancestors.push(node);
	}

	let frame = 0;

	const position = () => {
		frame = 0;

		let left = 0;
		let top = 0;
		let right = doc.documentElement.clientWidth;
		let bottom = doc.documentElement.clientHeight;

		for (const node of ancestors) {
			if (node === doc.documentElement) continue;

			const rect = node.getBoundingClientRect();
			const style = win.getComputedStyle(node);
			const scaleX = node.offsetWidth ? rect.width / node.offsetWidth : 1;
			const scaleY = node.offsetHeight ? rect.height / node.offsetHeight : 1;
			const x = rect.left + node.clientLeft * scaleX;
			const y = rect.top + node.clientTop * scaleY;

			if (node === parent || style.overflowX !== "visible") {
				left = Math.max(left, x);
				right = Math.min(right, x + node.clientWidth * scaleX);
			}

			if (node === parent || style.overflowY !== "visible") {
				top = Math.max(top, y);
				bottom = Math.min(bottom, y + node.clientHeight * scaleY);
			}
		}

		const rect = anchor.getBoundingClientRect();

		if (rect.width && rect.height && right > left && bottom > top) {
			const x =
				(((left + right) / 2 - rect.left) * anchor.offsetWidth) / rect.width;

			const y =
				(((top + bottom) / 2 - rect.top) * anchor.offsetHeight) / rect.height;

			anchor.style.setProperty("--spinner-x", `${x}px`);
			anchor.style.setProperty("--spinner-y", `${y}px`);
		}
	};

	const schedule = () => {
		if (!frame) frame = win.requestAnimationFrame(position);
	};

	const block = (event: Event) => {
		if (event.type === "keydown" && (event as KeyboardEvent).key === "Tab")
			return;

		if (!event.composedPath().includes(parent)) return;

		event.preventDefault();
		event.stopImmediatePropagation();
	};

	const events = [
		"click",
		"auxclick",
		"pointerdown",
		"wheel",
		"touchmove",
		"keydown",
	];

	const observer = new ResizeObserver(schedule);

	for (const node of [anchor, ...ancestors]) observer.observe(node);

	for (const event of events) {
		win.addEventListener(event, block, { capture: true, passive: false });
	}

	win.addEventListener("scroll", schedule, true);
	win.addEventListener("resize", schedule);
	position();

	return () => {
		for (const event of events) win.removeEventListener(event, block, true);

		win.removeEventListener("scroll", schedule, true);
		win.removeEventListener("resize", schedule);
		win.cancelAnimationFrame(frame);
		observer.disconnect();
		anchor.style.removeProperty("--spinner-x");
		anchor.style.removeProperty("--spinner-y");
	};
};

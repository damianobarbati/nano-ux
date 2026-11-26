import cx from "clsx-tw";
import { IFilter } from "nano-ux/icons";
import React from "react";

type ThemeDrawerProps = {
	className?: string;
	children: React.ReactNode;
};

const fitRect = (from: DOMRect, to: DOMRect) => {
	const x = to.left - from.left;
	const y = to.top - from.top;
	return `translate(${x}px, ${y}px) scale(${to.width / from.width}, ${to.height / from.height})`;
};

export const ThemeDrawer = ({ className, children }: ThemeDrawerProps) => {
	const slot = React.useRef<HTMLDivElement>(null);
	const tab = React.useRef<HTMLButtonElement>(null);
	const panel = React.useRef<HTMLDivElement>(null);
	const origin = React.useRef<DOMRect | null>(null);
	const flight = React.useRef<Animation | null>(null);
	const [height, setHeight] = React.useState(0);
	const [open, setOpen] = React.useState(false);
	const docked = height > 0;

	React.useEffect(() => {
		const element = slot.current;
		if (!element) return;

		const desktop = matchMedia(
			"(min-width: 1024px) and (hover: hover) and (pointer: fine)",
		);

		let wasDocked = false;
		let initialized = false;

		const update = () => {
			const rect = element.getBoundingClientRect();

			const nextDocked = desktop.matches && rect.top + rect.height / 2 <= 0;

			if (nextDocked !== wasDocked && tab.current && panel.current) {
				origin.current = null;

				if (
					initialized &&
					desktop.matches &&
					!matchMedia("(prefers-reduced-motion: reduce)").matches
				) {
					const moving = flight.current?.playState === "running";

					const fromPanel =
						nextDocked ||
						moving ||
						tab.current.getAttribute("aria-expanded") === "true";

					const from = (
						fromPanel ? panel.current : tab.current
					).getBoundingClientRect();

					// Fast scroll can carry the whole card above the viewport between frames.
					origin.current =
						nextDocked && from.bottom < 24
							? new DOMRect(from.x, 24 - from.height, from.width, from.height)
							: from;
				}

				flight.current?.cancel();
			}

			initialized = true;
			wasDocked = nextDocked;

			if (nextDocked) {
				setHeight(rect.height);
			} else {
				setHeight(0);
				setOpen(false);
			}
		};

		update();
		window.addEventListener("scroll", update, { passive: true });
		window.addEventListener("resize", update);
		desktop.addEventListener("change", update);

		const observer = new ResizeObserver(update);
		observer.observe(element);

		return () => {
			window.removeEventListener("scroll", update);
			window.removeEventListener("resize", update);
			desktop.removeEventListener("change", update);
			observer.disconnect();
		};
	}, []);

	React.useLayoutEffect(() => {
		const card = panel.current;
		const button = tab.current;
		const from = origin.current;

		origin.current = null;

		if (!from || !card || !button) return;

		const layout = card.getBoundingClientRect();
		const to = docked ? button.getBoundingClientRect() : layout;

		const animation = card.animate(
			[
				{ transform: fitRect(layout, from), opacity: docked ? 1 : 0.25 },
				{ transform: fitRect(layout, to), opacity: docked ? 0.25 : 1 },
			],
			{ duration: 520, easing: "cubic-bezier(.22,.72,.18,1)" },
		);

		flight.current = animation;

		const reveal = docked
			? button.animate(
					[{ opacity: 0 }, { opacity: 0, offset: 0.55 }, { opacity: 1 }],
					520,
				)
			: null;

		return () => {
			animation.cancel();
			reveal?.cancel();
		};
	}, [docked]);

	const handleOpen = () => {
		if (docked) {
			flight.current?.cancel();
			setOpen(true);
		}
	};

	const handlePointerLeave = (event: React.PointerEvent<HTMLDivElement>) => {
		if (!event.buttons) setOpen(false);
	};

	const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
		const target = document.elementFromPoint(event.clientX, event.clientY);
		if (!event.currentTarget.contains(target)) setOpen(false);
	};

	const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
		if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (!docked || event.key !== "Escape" || event.defaultPrevented) return;

		setOpen(false);
		tab.current?.focus({ preventScroll: true });
	};

	return (
		<div
			className={cx("min-w-0", className)}
			ref={slot}
			style={docked ? { height } : undefined}
		>
			<div
				className="theme-drawer"
				data-docked={docked || undefined}
				data-open={open || undefined}
				onPointerEnter={handleOpen}
				onPointerLeave={handlePointerLeave}
				onPointerUp={handlePointerUp}
				onBlur={handleBlur}
				onKeyDown={handleKeyDown}
			>
				<button
					className="theme-drawer-tab"
					type="button"
					ref={tab}
					hidden={!docked}
					aria-label="Theme settings"
					aria-expanded={open}
					aria-controls="theme-settings"
					onClick={handleOpen}
				>
					<IFilter className="size-7" aria-hidden="true" />
				</button>
				<div
					id="theme-settings"
					ref={panel}
					className="card @container grid min-w-0 origin-top-left gap-4"
					inert={docked && !open}
				>
					{children}
				</div>
			</div>
		</div>
	);
};

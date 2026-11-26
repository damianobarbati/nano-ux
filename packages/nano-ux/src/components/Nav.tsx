"use client";

import cx from "clsx-tw";
import React from "react";
import * as z from "zod/mini";
import { IClose, IMenu } from "../icons.tsx";

export const NavPropsSchema = z.object({
	strings: z.optional(
		z.object({
			open: z.optional(z.string()),
			close: z.optional(z.string()),
		}),
	),
	className: z.optional(z.string()),
	label: z.string(),
	children: z.custom<React.ReactNode>(),
	openLabel: z.optional(z.string()),
	closeLabel: z.optional(z.string()),
});

export type NavProps = z.infer<typeof NavPropsSchema>;

export const Nav = ({
	strings,
	className,
	label,
	children,
	openLabel = strings?.open ?? "Open navigation",
	closeLabel = strings?.close ?? "Close navigation",
}: NavProps) => {
	const [open, setOpen] = React.useState(false);
	const panelId = React.useId();
	const trigger = React.useRef<HTMLButtonElement>(null);
	const panel = React.useRef<HTMLDialogElement>(null);

	const handleOpen = () => {
		const dialog = panel.current;
		if (!dialog || dialog.open) return;

		dialog.showModal();
		setOpen(true);
		dialog.querySelector<HTMLElement>("nav a[href]")?.focus();
	};

	const handleDismiss = () => {
		panel.current?.close();
		setOpen(false);
		trigger.current?.focus({ preventScroll: true });
	};

	const handlePanelClick = (event: React.MouseEvent<HTMLDialogElement>) => {
		if (!open || !(event.target instanceof Element)) return;

		if (event.target.closest("a[href]")) {
			handleDismiss();

			requestAnimationFrame(() => {
				if (document.activeElement === document.body)
					trigger.current?.focus({ preventScroll: true });
			});

			return;
		}

		if (event.target !== event.currentTarget) return;

		const rect = event.currentTarget.getBoundingClientRect();

		if (
			event.clientX < rect.left ||
			event.clientX >= rect.right ||
			event.clientY < rect.top ||
			event.clientY >= rect.bottom
		)
			handleDismiss();
	};

	const handlePanelKeyDown = (
		event: React.KeyboardEvent<HTMLDialogElement>,
	) => {
		if (!open || event.key !== "Tab" || event.defaultPrevented) return;

		const elements = event.currentTarget.querySelectorAll<HTMLElement>(
			'a[href], button, input, select, textarea, [tabindex], [contenteditable="true"]',
		);

		const stops = Array.from(elements).filter(
			(element) =>
				element.tabIndex >= 0 &&
				!element.matches(":disabled") &&
				!element.closest("[inert]") &&
				element.checkVisibility({ visibilityProperty: true }),
		);

		const edge = event.shiftKey ? stops[0] : stops.at(-1);
		if (document.activeElement !== edge) return;

		event.preventDefault();

		const next = event.shiftKey ? stops.at(-1) : stops[0];
		next?.focus();
	};

	const handleCancel = (event: React.SyntheticEvent<HTMLDialogElement>) => {
		event.preventDefault();
		handleDismiss();
	};

	React.useEffect(() => {
		if (!open) return;

		const desktop = window.matchMedia("(min-width: 64rem)");

		const handleResize = () => {
			if (!desktop.matches) return;

			panel.current?.close();
			setOpen(false);
			panel.current?.querySelector<HTMLElement>("nav a[href]")?.focus();
		};

		handleResize();
		desktop.addEventListener("change", handleResize);
		return () => desktop.removeEventListener("change", handleResize);
	}, [open]);

	return (
		<>
			<button
				type="button"
				ref={trigger}
				title={openLabel}
				aria-haspopup="dialog"
				aria-expanded={open}
				aria-controls={panelId}
				className="inline-flex h-11 shrink-0 cursor-pointer items-center justify-center rounded-control px-0 hover:bg-layer focus-visible:outline-2 focus-visible:outline-focus lg:hidden"
				onClick={handleOpen}
			>
				<IMenu className="size-6" />
			</button>
			<dialog
				id={panelId}
				ref={panel}
				role={open ? "dialog" : "presentation"}
				aria-label={open ? label : undefined}
				data-nano-nav-open={open || undefined}
				className="fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-[min(20rem,80vw)] overflow-y-auto overscroll-contain border-r border-border bg-surface p-4 text-fg shadow-xl backdrop:bg-fg/40 lg:contents"
				onKeyDown={handlePanelKeyDown}
				onCancel={handleCancel}
				onClick={handlePanelClick}
			>
				<button
					type="button"
					title={closeLabel}
					className="mb-2 grid size-11 place-items-center rounded-control hover:bg-layer lg:hidden"
					onClick={handleDismiss}
				>
					<IClose className="size-6" />
				</button>
				<nav
					aria-label={label}
					className={cx(
						"flex gap-2 max-lg:flex-col lg:items-center lg:gap-5",
						className,
					)}
				>
					{children}
				</nav>
			</dialog>
		</>
	);
};

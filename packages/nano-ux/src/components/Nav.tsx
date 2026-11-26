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
	const trigger = React.useRef<HTMLButtonElement>(null);
	const panel = React.useRef<HTMLElement>(null);

	React.useEffect(() => {
		if (!open) return;

		const desktop = window.matchMedia("(min-width: 64rem)");

		const closeOnDesktop = () => {
			if (desktop.matches) setOpen(false);
		};

		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key !== "Escape" || event.defaultPrevented) return;
			setOpen(false);
			trigger.current?.focus({ preventScroll: true });
		};

		closeOnDesktop();

		const firstLink = panel.current?.querySelector<HTMLElement>("a[href]");

		(firstLink ?? panel.current)?.focus({ preventScroll: true });
		desktop.addEventListener("change", closeOnDesktop);
		document.addEventListener("keydown", closeOnEscape);

		return () => {
			desktop.removeEventListener("change", closeOnDesktop);
			document.removeEventListener("keydown", closeOnEscape);
		};
	}, [open]);

	const Icon = open ? IClose : IMenu;
	return (
		<>
			<button
				type="button"
				ref={trigger}
				title={open ? closeLabel : openLabel}
				className="inline-flex h-11 shrink-0 cursor-pointer items-center justify-center rounded-control px-0 hover:bg-layer focus-visible:outline-2 focus-visible:outline-focus lg:hidden"
				onClick={() => setOpen(!open)}
			>
				<Icon className="size-6" />
			</button>
			<button
				type="button"
				title={closeLabel}
				tabIndex={-1}
				className={cx(
					"fixed inset-x-0 top-14 bottom-0 z-40 bg-fg/40 transition-[opacity,visibility] duration-200 motion-reduce:transition-none lg:hidden",
					!open && "pointer-events-none invisible opacity-0",
				)}
				onClick={() => {
					setOpen(false);
					trigger.current?.focus({ preventScroll: true });
				}}
			/>
			<nav
				ref={panel}
				tabIndex={-1}
				title={label}
				data-nano-nav-open={open || undefined}
				className={cx(
					"flex gap-2 motion-reduce:transition-none max-lg:fixed max-lg:inset-y-0 max-lg:top-14 max-lg:left-0 max-lg:z-50 max-lg:w-[min(20rem,80vw)] max-lg:flex-col max-lg:overflow-y-auto max-lg:overscroll-contain max-lg:border-r max-lg:border-border max-lg:bg-surface max-lg:p-4 max-lg:shadow-xl motion-safe:max-lg:duration-200 lg:items-center lg:gap-5",
					open
						? "motion-safe:max-lg:transition-[translate]"
						: "max-lg:invisible max-lg:-translate-x-full max-lg:[interactivity:inert] motion-safe:max-lg:transition-[translate,visibility]",
					className,
				)}
				onClick={(event) => {
					if (
						open &&
						event.target instanceof Element &&
						event.target.closest("a[href]")
					)
						setOpen(false);
				}}
			>
				{children}
			</nav>
		</>
	);
};

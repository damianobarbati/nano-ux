"use client";

import cx from "clsx-tw";
import React from "react";
import * as z from "zod/mini";
import { IChevronDown } from "../icons.tsx";

import { Accordion } from "./Accordion.tsx";

export type SectionNavSection = {
	id: string;
	title: string;
	items: { label: string; href: string }[];
	collapsible?: boolean;
	defaultExpanded?: boolean;
};

export const SectionNavPropsSchema = z.object({
	className: z.optional(z.string()),
	label: z.optional(z.string()),
	sections: z.custom<SectionNavSection[]>(),
	currentHref: z.optional(z.string()),
});

export type SectionNavProps = z.infer<typeof SectionNavPropsSchema>;

export const SectionNav = ({
	className,
	label = "Sections",
	sections,
	currentHref,
}: SectionNavProps) => {
	const [menuOpen, setMenuOpen] = React.useState(false);
	const menuId = React.useId();

	const [sectionHref, setSectionHref] = React.useState<string>();

	React.useEffect(() => {
		const targets: {
			href: string;
			element: HTMLElement;
			scrollMargin: number;
		}[] = [];

		for (const { items } of sections) {
			for (const { href } of items) {
				if (!href.startsWith("#")) continue;

				const element = document.getElementById(href.slice(1));

				if (element) {
					const scrollMargin =
						Number.parseFloat(getComputedStyle(element).scrollMarginTop) || 0;

					targets.push({ href, element, scrollMargin });
				}
			}
		}

		if (!targets.length) {
			setSectionHref(undefined);
			return;
		}

		const updateSection = () => {
			const atBottom =
				window.scrollY > 0 &&
				window.scrollY + window.innerHeight >=
					document.documentElement.scrollHeight - 1;

			let closestTop = -Infinity;
			let activeHref = targets[0].href;

			for (const { href, element, scrollMargin } of targets) {
				const top = element.getBoundingClientRect().top;
				const threshold = atBottom ? window.innerHeight : scrollMargin + 1;

				if (top <= threshold && top > closestTop) {
					closestTop = top;
					activeHref = href;
				}
			}

			setSectionHref(activeHref);
		};

		updateSection();
		window.addEventListener("scroll", updateSection, { passive: true });
		window.addEventListener("resize", updateSection);

		return () => {
			window.removeEventListener("scroll", updateSection);
			window.removeEventListener("resize", updateSection);
		};
	}, [sections]);

	const activeHref =
		currentHref && !currentHref.startsWith("#")
			? currentHref
			: (sectionHref ?? currentHref);

	const current =
		activeHref && activeHref.startsWith("#") ? "location" : "page";

	const handleMenuClick = () => setMenuOpen(!menuOpen);

	return (
		<nav
			className={cx(
				"min-w-0 text-sm text-fg lg:sticky lg:top-4 lg:max-h-[calc(100dvh-2rem)] lg:self-start lg:overflow-y-auto",
				className,
			)}
			aria-label={label}
		>
			<button
				className="button button-secondary button-outline button-md w-full justify-between rounded-control lg:hidden"
				type="button"
				aria-controls={menuId}
				aria-expanded={menuOpen}
				onClick={handleMenuClick}
			>
				{label}
				<IChevronDown
					className={cx("size-4", menuOpen && "rotate-180")}
					aria-hidden="true"
				/>
			</button>
			<div
				id={menuId}
				className={cx("space-y-6 pt-5 lg:block lg:pt-0", !menuOpen && "hidden")}
			>
				{sections.map(
					({ id, title, items, collapsible, defaultExpanded = true }) => {
						const links = (
							<ul className="m-0 list-none space-y-1 p-0">
								{items.map(({ label, href }) => (
									<li key={href}>
										<a
											className="block rounded-control px-3 py-2 wrap-anywhere hover:bg-layer hover:text-[color:var(--color-brand,var(--color-fg))] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus aria-[current]:bg-layer aria-[current]:font-semibold aria-[current]:text-[color:var(--color-brand,var(--color-fg))]"
											href={href}
											aria-current={href === activeHref ? current : undefined}
										>
											{label}
										</a>
									</li>
								))}
							</ul>
						);

						if (collapsible) {
							return (
								<Accordion
									key={id}
									className="border-0 bg-transparent [&>div>div>div]:p-0 [&>h2]:text-sm [&>h2>button]:min-h-10 [&>h2>button]:px-0"
									title={title}
									defaultExpanded={defaultExpanded}
								>
									{links}
								</Accordion>
							);
						}

						return (
							<div key={id}>
								<p className="m-0 mb-2 font-semibold">{title}</p>
								{links}
							</div>
						);
					},
				)}
			</div>
		</nav>
	);
};

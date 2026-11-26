"use client";

import cx from "clsx-tw";
import React from "react";
import * as z from "zod/mini";
import { IChevronDown } from "../icons.tsx";

export const AccordionPropsSchema = z.object({
	title: z.string(),
	summary: z.optional(z.string()),
	action: z.optional(z.string()),
	children: z.custom<React.ReactNode>(),
	expanded: z.optional(z.boolean()),
	defaultExpanded: z.optional(z.boolean()),
	onExpandedChange: z.optional(z.custom<(expanded: boolean) => void>()),
	disabled: z.optional(z.boolean()),
	className: z.optional(z.string()),
	ref: z.optional(z.custom<React.Ref<HTMLButtonElement>>()),
});

export type AccordionProps = z.infer<typeof AccordionPropsSchema>;

export const Accordion = ({
	title,
	summary,
	action,
	children,
	expanded,
	defaultExpanded = false,
	onExpandedChange,
	disabled,
	className,
	ref,
}: AccordionProps) => {
	const [localExpanded, setLocalExpanded] = React.useState(defaultExpanded);
	const open = expanded ?? localExpanded;

	const toggle = () => {
		if (expanded === undefined) setLocalExpanded(!open);
		onExpandedChange?.(!open);
	};

	return (
		<section
			className={cx(
				"rounded-card border border-border bg-surface text-fg",
				className,
			)}
		>
			<h2 className="m-0">
				<button
					type="button"
					ref={ref}
					aria-expanded={open}
					disabled={disabled}
					onClick={toggle}
					className="group flex min-h-16 w-full items-center gap-2 rounded-control px-5 py-2 text-left focus-visible:outline-2 focus-visible:outline-focus disabled:opacity-50"
				>
					<span className="text-box-trim font-semibold">{title}</span>
					{summary && (
						<span
							title={summary}
							className="min-w-0 truncate text-sm font-normal text-fg-muted"
						>
							{summary}
						</span>
					)}
					<span className="ms-auto text-sm font-normal">{action}</span>
					<IChevronDown className="size-4 shrink-0 group-aria-expanded:rotate-180 motion-safe:transition-transform motion-safe:duration-200" />
				</button>
			</h2>
			<div
				inert={!open}
				className={cx(
					"grid motion-safe:transition-[grid-template-rows] motion-safe:duration-200 motion-safe:ease-in-out",
					open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
				)}
			>
				<div className="min-h-0 overflow-hidden">
					<div className="px-5 pb-4">{children}</div>
				</div>
			</div>
		</section>
	);
};

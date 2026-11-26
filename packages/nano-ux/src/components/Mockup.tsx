import cx from "clsx-tw";
import type React from "react";
import * as z from "zod/mini";

export const MockupPropsSchema = z.object({
	className: z.optional(z.string()),
	variant: z.optional(z.enum(["browser", "smartphone", "terminal"])),
});

export type MockupProps = z.infer<typeof MockupPropsSchema> &
	(React.HTMLAttributes<HTMLDivElement> &
		(
			| { variant?: "browser"; address?: string; appearance?: never }
			| { variant: "smartphone"; address?: never; appearance?: never }
			| { variant: "terminal"; address?: never; appearance?: "light" | "dark" }
		));

export const Mockup = ({
	variant = "browser",
	address,
	appearance,
	children,
	className,
	...props
}: MockupProps) => {
	if (variant === "smartphone") {
		return (
			<div
				{...props}
				className={cx(
					"flex aspect-[9/19] w-full max-w-64 flex-col overflow-hidden rounded-[2rem] border-[6px] border-device-frame bg-surface text-fg shadow-sm",
					className,
				)}
			>
				<div className="mx-auto my-2 h-2 w-12 shrink-0 rounded-full bg-device-frame" />
				<div className="min-h-0 flex-1 overflow-auto">{children}</div>
				<div className="mx-auto my-2 h-1 w-16 shrink-0 rounded-full bg-fg-muted" />
			</div>
		);
	}

	const terminal = variant === "terminal";

	const contentClassName = terminal
		? "overflow-x-auto p-4 text-left font-mono text-sm whitespace-pre-wrap"
		: "min-w-0";

	return (
		<div
			{...props}
			className={cx(
				"min-w-0 overflow-hidden rounded-card border border-border bg-surface text-fg shadow-sm",
				appearance,
				className,
			)}
		>
			<div
				className="flex h-10 items-center gap-4 border-b border-border bg-inherit px-5"
				data-mockup-bar=""
			>
				<span className="flex shrink-0 gap-2">
					<span className="size-2.5 rounded-full bg-[#ff5f57]" />
					<span className="size-2.5 rounded-full bg-[#febc2e]" />
					<span className="size-2.5 rounded-full bg-[#28c840]" />
				</span>
				{!terminal && address?.trim() && (
					<span className="min-w-0 flex-1 truncate rounded-control bg-layer px-3 py-1 text-xs text-fg-muted">
						{address}
					</span>
				)}
			</div>
			<div className={contentClassName}>{children}</div>
		</div>
	);
};

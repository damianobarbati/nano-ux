"use client";

import cx from "clsx-tw";
import * as React from "react";
import * as z from "zod/mini";

export const TooltipPropsSchema = z.object({
	children:
		z.custom<
			React.ReactElement<Pick<React.AriaAttributes, "aria-describedby">>
		>(),
	className: z.optional(z.string()),
	content: z.custom<React.ReactNode>(),
	placement: z.optional(z.enum(["top", "bottom"])),
});

export type TooltipProps = z.infer<typeof TooltipPropsSchema>;

export const Tooltip = ({
	children,
	className,
	content,
	placement = "top",
}: TooltipProps) => {
	const tooltipId = React.useId();

	const describedBy = [children.props["aria-describedby"], tooltipId]
		.filter(Boolean)
		.join(" ");

	const trigger = React.cloneElement(children, {
		"aria-describedby": describedBy,
	});

	const bubble = React.useRef<HTMLSpanElement>(null);
	const closeTimer = React.useRef<number | undefined>(undefined);
	const hovered = React.useRef(false);
	const focused = React.useRef(false);
	const [open, setOpen] = React.useState(false);

	const closeWhenIdle = () => {
		window.clearTimeout(closeTimer.current);

		closeTimer.current = window.setTimeout(() => {
			if (!hovered.current && !focused.current) setOpen(false);
		}, 150);
	};

	React.useEffect(() => () => window.clearTimeout(closeTimer.current), []);

	React.useLayoutEffect(() => {
		const element = bubble.current;
		const anchor = element?.previousElementSibling;
		if (!open || !element || !anchor) return;

		element.showPopover();

		let frame = 0;

		const position = () => {
			const viewport = window.visualViewport;
			const width = viewport?.width ?? document.documentElement.clientWidth;
			const height = viewport?.height ?? document.documentElement.clientHeight;
			const left = viewport?.offsetLeft ?? 0;
			const top = viewport?.offsetTop ?? 0;
			const margin = 8;
			const rect = anchor.getBoundingClientRect();

			element.style.maxWidth = `${Math.max(0, width - 2 * margin)}px`;
			element.style.maxHeight = `${Math.max(0, height - 2 * margin)}px`;

			const size = element.getBoundingClientRect();
			const above = rect.top - top - margin;
			const below = top + height - margin - rect.bottom;
			const fitsAbove = above >= size.height;
			const fitsBelow = below >= size.height;

			const useAbove =
				fitsAbove && fitsBelow ? placement === "top" : above >= below;

			const x = rect.left + (rect.width - size.width) / 2;

			const y = useAbove ? rect.top - size.height : rect.bottom;

			element.style.left = `${Math.max(left + margin, Math.min(x, left + width - size.width - margin))}px`;
			element.style.top = `${Math.max(top + margin, Math.min(y, top + height - size.height - margin))}px`;
			frame = window.requestAnimationFrame(position);
		};

		const dismiss = (event: KeyboardEvent) => {
			if (event.key === "Escape") setOpen(false);
		};

		position();
		document.addEventListener("keydown", dismiss, true);

		return () => {
			window.cancelAnimationFrame(frame);
			document.removeEventListener("keydown", dismiss, true);
			element.hidePopover();
		};
	}, [open, placement]);

	return (
		<span
			className="contents"
			onPointerEnter={(event) => {
				if (event.pointerType === "touch") return;

				hovered.current = true;
				setOpen(true);
			}}
			onPointerLeave={() => {
				hovered.current = false;
				closeWhenIdle();
			}}
			onFocus={(event) => {
				focused.current = event.target.matches(":focus-visible");

				if (focused.current) setOpen(true);
			}}
			onBlur={() => {
				focused.current = false;
				closeWhenIdle();
			}}
			onClick={(event) => {
				if (!bubble.current?.contains(event.target as Node)) setOpen(false);
			}}
		>
			{trigger}
			<span
				id={tooltipId}
				role="tooltip"
				ref={bubble}
				popover="manual"
				className="nano-tooltip fixed inset-auto m-0 w-max overflow-auto border-0 bg-transparent p-0 py-2"
			>
				<span
					className={cx(
						"block rounded-control border border-border bg-surface px-2.5 py-1.5 text-xs font-medium wrap-anywhere whitespace-normal text-fg shadow-sm select-text",
						className,
					)}
				>
					{content}
				</span>
			</span>
		</span>
	);
};

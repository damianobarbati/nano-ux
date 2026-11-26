"use client";

import cx from "clsx-tw";
import React from "react";
import * as z from "zod/mini";
import { Button } from "./Button.tsx";

export const DialogPropsSchema = z.object({
	strings: z.optional(
		z.object({
			confirm: z.optional(z.string()),
			close: z.optional(z.string()),
			cancel: z.optional(z.string()),
			loading: z.optional(z.string()),
		}),
	),
	className: z.optional(z.string()),
	open: z.boolean(),
	title: z.string(),
	children: z.custom<React.ReactNode>(),
	confirmLabel: z.optional(z.string()),
	fullscreen: z.optional(z.boolean()),
	closeOnBackdrop: z.optional(z.boolean()),
	closeLabel: z.optional(z.string()),
	cancelLabel: z.optional(z.string()),
	onConfirm: z.optional(z.custom<() => void>()),
	onClose: z.custom<() => void>(),
	busy: z.optional(z.boolean()),
});

export type DialogProps = z.infer<typeof DialogPropsSchema>;

export const Dialog = ({
	strings,
	className,
	open,
	title,
	children,
	confirmLabel = strings?.confirm ?? "Confirm",
	fullscreen = false,
	closeOnBackdrop = false,
	closeLabel = strings?.close ?? "Close",
	cancelLabel = strings?.cancel ?? "Cancel",
	onConfirm,
	onClose,
	busy = false,
}: DialogProps) => {
	const ref = React.useRef<HTMLDialogElement>(null);
	const titleId = React.useId();

	React.useEffect(() => {
		const dialog = ref.current;
		if (!dialog) return;

		if (open && !dialog.open) {
			dialog.setAttribute("autofocus", "");
			dialog.showModal();

			const fields = dialog.querySelectorAll<
				HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
			>(
				':is(input:not([type="hidden"], [type="button"], [type="submit"], [type="reset"], [type="image"]), textarea, select):not(:disabled, [readonly])',
			);

			for (const field of fields) {
				if (!dialog.contains(field.form) || field.closest("dialog") !== dialog)
					continue;

				field.focus();

				if (dialog.ownerDocument.activeElement === field) return;
			}

			if (dialog.ownerDocument.activeElement !== dialog)
				dialog.focus({ preventScroll: true });
		}

		if (!open && dialog.open) dialog.close();
	}, [open]);

	React.useEffect(() => {
		const dialog = ref.current;
		return () => {
			if (dialog?.open) dialog.close();
		};
	}, []);

	const layoutClassName = fullscreen
		? "m-0 h-dvh max-h-none w-full max-w-none px-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]"
		: "m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md rounded-card border p-6";

	return (
		<dialog
			ref={ref}
			className={cx(
				"flex-col border-border bg-surface text-fg shadow-xl backdrop:bg-fg/50 open:flex focus:outline-none",
				layoutClassName,
				className,
			)}
			aria-labelledby={titleId}
			data-nano-dialog=""
			onClick={(event) => {
				if (
					!closeOnBackdrop ||
					busy ||
					event.target !== event.currentTarget ||
					event.detail === 0
				)
					return;

				const rect = event.currentTarget.getBoundingClientRect();

				if (
					event.clientX < rect.left ||
					event.clientX >= rect.right ||
					event.clientY < rect.top ||
					event.clientY >= rect.bottom
				)
					onClose();
			}}
			onCancel={(event) => {
				event.preventDefault();

				if (!busy) onClose();
			}}
			onClose={() => {
				if (open && !ref.current?.open) onClose();
			}}
		>
			<header className="flex shrink-0 items-center justify-between gap-3">
				<h2 id={titleId}>{title}</h2>
				{!onConfirm && (
					<Button variant="ghost" disabled={busy} onClick={onClose}>
						{closeLabel}
					</Button>
				)}
			</header>
			<div className="mt-3 min-h-0 overflow-y-auto overscroll-contain text-sm text-fg-muted">
				{children}
			</div>
			{onConfirm && (
				<footer className="mt-6 flex shrink-0 justify-end gap-3">
					<Button variant="ghost" disabled={busy} onClick={onClose}>
						{cancelLabel}
					</Button>
					<Button strings={strings} loading={busy} onClick={onConfirm}>
						{confirmLabel}
					</Button>
				</footer>
			)}
		</dialog>
	);
};

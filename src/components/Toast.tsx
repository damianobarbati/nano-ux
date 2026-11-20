"use client";

import cx from "clsx-tw";
import React from "react";
import { IClose } from "../icons.tsx";
import { Button } from "./Button.tsx";

const tones = {
	info: "bg-layer text-fg",
	success: "bg-success-surface text-success",
	warning: "bg-warning-surface text-warning",
	error: "bg-danger-surface text-danger",
};

export type ToastProps = {
	className?: string;
	message?: string;
	tone?: keyof typeof tones;
	duration?: number;
	onClose?: (reason: "dismiss" | "timeout") => void;
};

export const Toast = (props: ToastProps) =>
	props.message ? <ToastNotice key={props.message} {...props} /> : null;

const ToastNotice = ({
	className,
	message,
	tone = "success",
	duration,
	onClose,
}: ToastProps) => {
	const element = React.useRef<HTMLDivElement>(null);
	const [closing, setClosing] = React.useState<"dismiss" | "timeout">();
	const canClose = !!onClose;

	const finish = React.useEffectEvent((reason: "dismiss" | "timeout") =>
		onClose?.(reason),
	);

	React.useEffect(() => {
		if (closing || !canClose || !duration || duration <= 0) return;

		const timer = window.setTimeout(() => setClosing("timeout"), duration);
		return () => window.clearTimeout(timer);
	}, [closing, canClose, duration]);

	React.useLayoutEffect(() => {
		if (!closing) return;

		const animation = element.current
			?.getAnimations()
			.find(
				(animation) =>
					animation instanceof CSSAnimation &&
					animation.animationName === "nano-snackbar-out",
			);

		if (!animation) {
			finish(closing);
			return;
		}

		const complete = () => finish(closing);

		animation.addEventListener("finish", complete);
		animation.addEventListener("cancel", complete);

		return () => {
			animation.removeEventListener("finish", complete);
			animation.removeEventListener("cancel", complete);
		};
	}, [closing]);

	return (
		<div
			ref={element}
			data-closing={!!closing}
			className={cx(
				"nano-snackbar rounded-control border border-current/20 p-4 text-sm",
				tones[tone],
				"fixed right-4 bottom-4 z-50 flex max-w-[calc(100vw-2rem)] items-center gap-4 shadow-lg sm:max-w-sm",
				className,
			)}
		>
			{message}
			{onClose && (
				<Button
					variant="ghost"
					size="sm"
					title="Dismiss notification"
					onClick={() => setClosing((reason) => reason ?? "dismiss")}
				>
					<IClose />
				</Button>
			)}
		</div>
	);
};

import cx from "clsx-tw";
import { Spinner, SpinnerProvider, type SpinnerRendererProps } from "nano-ux";
import React from "react";

const Pulse = ({ className }: SpinnerRendererProps) => (
	<span
		className={cx(
			className,
			"rounded-full bg-current motion-safe:animate-pulse",
		)}
		aria-hidden="true"
	/>
);

type PulseSpinnerProps = { className?: string };

export const PulseSpinner = ({ className }: PulseSpinnerProps) => (
	<SpinnerProvider variants={{ pulse: Pulse }} defaultVariant="orbit">
		<div className={cx("flex items-center gap-3", className)}>
			<Spinner centered={false} label="Loading profiles" />
			<Spinner centered={false} variant="pulse" label="Loading activity" />
		</div>
	</SpinnerProvider>
);

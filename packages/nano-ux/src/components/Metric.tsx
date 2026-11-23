"use client";

import cx from "clsx-tw";
import * as React from "react";

export type MetricProps = {
	className?: string;
	decimals?: number;
	label: string;
	suffix?: string;
	value: number;
};

export const Metric = ({
	className,
	decimals = 0,
	label,
	suffix = "",
	value,
}: MetricProps) => {
	const ref = React.useRef<HTMLDivElement>(null);
	const [currentValue, setCurrentValue] = React.useState(0);

	React.useEffect(() => {
		const element = ref.current;
		if (!element) return;

		const reduceMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		if (reduceMotion || !("IntersectionObserver" in window)) {
			setCurrentValue(value);
			return;
		}

		let frame = 0;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;

				const startedAt = performance.now();
				const duration = 900;

				const update = (now: number) => {
					const progress = Math.min((now - startedAt) / duration, 1);

					setCurrentValue(value * (1 - (1 - progress) ** 3));

					if (progress < 1) frame = requestAnimationFrame(update);
				};

				frame = requestAnimationFrame(update);
				observer.disconnect();
			},
			{ threshold: 0.35 },
		);

		observer.observe(element);

		return () => {
			observer.disconnect();
			cancelAnimationFrame(frame);
		};
	}, [value]);

	const displayValue = currentValue.toLocaleString("en-US", {
		maximumFractionDigits: decimals,
		minimumFractionDigits: decimals,
	});

	return (
		<div
			className={cx(
				"card flex flex-col items-center justify-center gap-2 text-center",
				className,
			)}
			ref={ref}
		>
			<p className="mb-0 font-label text-fg-muted">{label}</p>
			<p className="mb-0 text-3xl leading-heading font-heading tracking-heading tabular-nums">
				{displayValue}
				{suffix}
			</p>
		</div>
	);
};

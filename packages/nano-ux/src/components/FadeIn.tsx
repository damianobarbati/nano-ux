"use client";

import cx from "clsx-tw";
import * as React from "react";
import * as z from "zod/mini";

export const FadeInPropsSchema = z.object({
	className: z.optional(z.string()),
});

export type FadeInProps = z.infer<typeof FadeInPropsSchema> &
	React.ComponentPropsWithoutRef<"section">;

export const FadeIn = ({
	children,
	className,
	...sectionProps
}: FadeInProps) => {
	const section = React.useRef<HTMLElement>(null);
	const [isVisible, setIsVisible] = React.useState(false);

	React.useEffect(() => {
		const element = section.current;
		if (!element) return;

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setIsVisible(true);
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;

				setIsVisible(true);
				observer.unobserve(entry.target);
			},
			{ threshold: 0.12 },
		);

		observer.observe(element);
		return () => observer.disconnect();
	}, []);

	return (
		<section
			{...sectionProps}
			className={cx(
				"transition-[opacity,transform] duration-600 ease-out motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:transition-none",
				isVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
				className,
			)}
			ref={section}
		>
			{children}
		</section>
	);
};

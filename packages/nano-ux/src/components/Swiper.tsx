"use client";

import cx from "clsx-tw";
import React from "react";
import * as z from "zod/mini";

export const SwiperPropsSchema = z.object({
	className: z.optional(z.string()),
	children: z.custom<React.ReactNode>(),
	index: z.optional(z.number()),
	onChangeIndex: z.optional(
		z.custom<(next: number, previous: number) => void>(),
	),
	autoHeight: z.optional(z.boolean()),
	swipeMany: z.optional(z.boolean()),
});

export type SwiperProps = z.infer<typeof SwiperPropsSchema>;

type ScrollToSlideOptions = {
	element: HTMLDivElement;
	index: number;
	animate: boolean;
};

type SlideOffsetOptions = Pick<ScrollToSlideOptions, "element" | "index">;

const getSlideOffset = ({ element, index }: SlideOffsetOptions) => {
	const slide = element.children[index];
	const first = element.firstElementChild;
	if (!slide || !first) return;

	const offset =
		slide.getBoundingClientRect().left - first.getBoundingClientRect().left;

	return offset;
};

const scrollToSlide = ({ element, index, animate }: ScrollToSlideOptions) => {
	const left = getSlideOffset({ element, index });
	if (left === undefined) return;

	const smooth =
		animate &&
		Math.abs(element.scrollLeft - left) >= 1 &&
		!window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	element.scrollTo({
		left,
		behavior: smooth ? "smooth" : "instant",
	});
};

export const Swiper = ({
	className,
	children,
	index,
	onChangeIndex,
	autoHeight = false,
	swipeMany = false,
}: SwiperProps) => {
	const slides = React.Children.toArray(children);
	const count = slides.length;
	const viewport = React.useRef<HTMLDivElement>(null);
	const selected = React.useRef(-1);
	const previousIndex = React.useRef(index);
	const [active, setActive] = React.useState(0);

	React.useLayoutEffect(() => {
		const element = viewport.current;
		if (!element) return;

		const next = Math.max(
			0,
			Math.min(Math.trunc(index ?? selected.current), count - 1),
		);

		const animate = index !== undefined && previousIndex.current !== index;

		previousIndex.current = index;

		if (selected.current === next) return;

		selected.current = next;
		setActive(next);
		scrollToSlide({ element, index: next, animate });
	}, [index, count]);

	const settle = React.useEffectEvent(() => {
		const element = viewport.current;
		if (!element || !element.firstElementChild) return;

		const width = element.firstElementChild.getBoundingClientRect().width;
		if (!width) return;

		const next = Math.min(
			count - 1,
			Math.round(Math.abs(element.scrollLeft) / width),
		);

		const previous = selected.current;
		if (next === previous) return;

		selected.current = next;
		setActive(next);

		if (onChangeIndex) onChangeIndex(next, previous);
	});

	React.useEffect(() => {
		const element = viewport.current;
		if (!element) return;

		if (Reflect.has(element, "onscrollend")) {
			element.addEventListener("scrollend", settle);
			return () => element.removeEventListener("scrollend", settle);
		}

		let timer: number;
		let touching = false;

		const schedule = () => {
			window.clearTimeout(timer);

			if (!touching) timer = window.setTimeout(settle, 150);
		};

		const touchStart = () => {
			touching = true;
			window.clearTimeout(timer);
		};

		const touchEnd = (event: TouchEvent) => {
			touching = event.touches.length > 0;
			schedule();
		};

		element.addEventListener("touchstart", touchStart, { passive: true });
		element.addEventListener("touchend", touchEnd);
		element.addEventListener("touchcancel", touchEnd);
		element.addEventListener("scroll", schedule);

		return () => {
			window.clearTimeout(timer);
			element.removeEventListener("scroll", schedule);
			element.removeEventListener("touchstart", touchStart);
			element.removeEventListener("touchend", touchEnd);
			element.removeEventListener("touchcancel", touchEnd);
		};
	}, []);

	const measureSlide = React.useCallback((slide: HTMLDivElement | null) => {
		if (!slide || !slide.parentElement) return;

		const element = slide.parentElement;

		const measure = () => {
			element.style.setProperty(
				"--swiper-height",
				`${slide.getBoundingClientRect().height}px`,
			);
		};

		measure();

		const observer = new ResizeObserver(measure);
		observer.observe(slide);
		return () => observer.disconnect();
	}, []);

	return (
		<div className={cx("min-w-0", className)}>
			<div
				ref={viewport}
				className={cx(
					"flex w-full snap-x snap-mandatory [scrollbar-width:none] items-start overflow-x-auto overflow-y-hidden",
					autoHeight &&
						count > 0 &&
						"h-(--swiper-height) motion-safe:transition-[height] motion-safe:duration-300 motion-safe:ease-in-out",
				)}
			>
				{React.Children.map(slides, (child, position) => (
					<div
						className={cx(
							"flow-root min-w-0 flex-[0_0_100%] snap-start",
							!swipeMany && "snap-always",
						)}
						inert={position !== active}
						ref={autoHeight && position === active ? measureSlide : undefined}
					>
						{child}
					</div>
				))}
			</div>
		</div>
	);
};

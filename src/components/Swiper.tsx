"use client";

import cx from "clsx-tw";
import React from "react";

export type SwiperProps = {
	className?: string;
	children: React.ReactNode;
	index?: number;
	onChangeIndex?: (next: number, previous: number) => void;
	autoHeight?: boolean;
	swipeMany?: boolean;
};

type ScrollToSlideOptions = {
	element: HTMLDivElement;
	index: number;
	animate: boolean;
};

const scrollToSlide = ({ element, index, animate }: ScrollToSlideOptions) => {
	const slide = element.children[index];
	const first = element.firstElementChild;
	if (!slide || !first) return;

	const smooth =
		animate && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	element.scrollTo({
		left:
			slide.getBoundingClientRect().left - first.getBoundingClientRect().left,
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
	const selected = React.useRef(0);
	const previousIndex = React.useRef(index);
	const animating = React.useRef(false);
	const [active, setActive] = React.useState(0);

	React.useLayoutEffect(() => {
		const element = viewport.current;
		if (!element) return;

		const next = Math.max(
			0,
			Math.min(Math.trunc(index ?? selected.current), count - 1),
		);

		const animate =
			index !== undefined &&
			previousIndex.current !== index &&
			selected.current !== next;

		animating.current = animate;

		previousIndex.current = index;
		selected.current = next;
		setActive(next);

		scrollToSlide({ element, index: next, animate });
	}, [index, count]);

	React.useEffect(() => {
		const element = viewport.current;
		if (!element || swipeMany) return;

		let lastWheelTime = -Infinity;
		let distance = 0;
		let moved = false;

		const handleWheel = (event: WheelEvent) => {
			if (event.ctrlKey || Math.abs(event.deltaX) <= Math.abs(event.deltaY))
				return;

			event.preventDefault();

			if (event.timeStamp - lastWheelTime > 180) {
				distance = 0;
				moved = false;
			}

			lastWheelTime = event.timeStamp;

			if (moved) return;

			distance += event.deltaX;

			if (
				event.deltaMode === WheelEvent.DOM_DELTA_PIXEL &&
				Math.abs(distance) < 12
			)
				return;

			moved = true;

			const direction = getComputedStyle(element).direction === "rtl" ? -1 : 1;
			const index = selected.current + Math.sign(distance) * direction;

			scrollToSlide({ element, index, animate: true });
		};

		element.addEventListener("wheel", handleWheel, { passive: false });
		return () => element.removeEventListener("wheel", handleWheel);
	}, [swipeMany]);

	const settle = React.useEffectEvent(() => {
		const element = viewport.current;
		const first = element?.firstElementChild;
		if (!element || !first) return;

		const width = first.getBoundingClientRect().width;
		if (!width) return;

		const next = Math.min(
			count - 1,
			Math.round(Math.abs(element.scrollLeft) / width),
		);

		const previous = selected.current;
		if (animating.current && next !== previous) return;
		animating.current = false;

		if (next === previous) return;

		selected.current = next;
		setActive(next);
		onChangeIndex?.(next, previous);
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
		const element = slide?.parentElement;
		if (!slide || !element) return;

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

	const interruptAnimation = () => {
		animating.current = false;
	};

	return (
		<div className={cx("min-w-0", className)}>
			<div
				ref={viewport}
				onPointerDownCapture={interruptAnimation}
				onWheelCapture={interruptAnimation}
				onKeyDownCapture={interruptAnimation}
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

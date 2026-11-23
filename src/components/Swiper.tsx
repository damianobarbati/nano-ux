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

type SlideOffsetOptions = Pick<ScrollToSlideOptions, "element" | "index">;

type TouchGesture = {
	pointerId: number;
	x: number;
	y: number;
	startOffset: number;
	minOffset: number;
	maxOffset: number;
	dragging: boolean;
};

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

const getDirection = (element: HTMLDivElement) => {
	const direction = getComputedStyle(element).direction === "rtl" ? -1 : 1;
	return direction;
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
	const destination = React.useRef<number | null>(null);
	const touch = React.useRef<TouchGesture | null>(null);
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

		touch.current = null;
		element.style.removeProperty("scroll-snap-type");
		destination.current = animate ? next : null;

		previousIndex.current = index;
		selected.current = next;
		setActive(next);

		scrollToSlide({ element, index: next, animate });
	}, [index, count, swipeMany]);

	const settle = React.useEffectEvent(() => {
		const element = viewport.current;
		const first = element?.firstElementChild;
		if (!element || !first || touch.current?.dragging) return;

		const width = first.getBoundingClientRect().width;
		if (!width) return;

		const target = destination.current;

		if (target !== null) {
			const offset = getSlideOffset({ element, index: target });

			if (offset === undefined || Math.abs(element.scrollLeft - offset) >= 1)
				return;
		}

		destination.current = null;

		const next =
			target ??
			Math.min(count - 1, Math.round(Math.abs(element.scrollLeft) / width));

		const previous = selected.current;
		if (next === previous) return;

		selected.current = next;
		setActive(next);
		onChangeIndex?.(next, previous);
	});

	const moveBy = React.useEffectEvent((direction: number) => {
		const element = viewport.current;
		if (!element || !count) return;

		const from = destination.current ?? selected.current;
		const next = Math.max(0, Math.min(from + direction, count - 1));

		destination.current = next;
		scrollToSlide({ element, index: next, animate: true });
		settle();
	});

	React.useEffect(() => {
		const element = viewport.current;
		if (!element || swipeMany) return;

		let lastWheelTime = -Infinity;
		let distance = 0;
		let direction = 0;
		let peak = 0;
		let trough = Infinity;

		const handleWheel = (event: WheelEvent) => {
			if (event.ctrlKey || Math.abs(event.deltaX) <= Math.abs(event.deltaY))
				return;

			event.preventDefault();

			if (touch.current?.dragging) return;

			if (event.timeStamp - lastWheelTime > 180) {
				distance = 0;
				direction = 0;
			}

			lastWheelTime = event.timeStamp;

			const delta = event.deltaX;
			const magnitude = Math.abs(delta);
			const threshold = event.deltaMode === WheelEvent.DOM_DELTA_PIXEL ? 12 : 0;

			if (Math.sign(delta) === direction) {
				distance = 0;
				peak = Math.max(peak, magnitude);

				// A new swipe can accelerate before the previous momentum stops.
				if (magnitude <= peak / 3) trough = Math.min(trough, magnitude);

				if (magnitude < Math.max(threshold, 3 * trough)) return;
			}

			distance += delta;

			if (Math.abs(distance) < threshold) return;

			direction = Math.sign(distance);
			distance = 0;
			peak = magnitude;
			trough = Infinity;
			moveBy(direction * getDirection(element));
		};

		element.addEventListener("wheel", handleWheel, { passive: false });
		return () => element.removeEventListener("wheel", handleWheel);
	}, [swipeMany]);

	React.useEffect(() => {
		const element = viewport.current;
		if (!element || swipeMany) return;

		const start = (event: PointerEvent) => {
			if (event.pointerType !== "touch" || !event.isPrimary) return;

			touch.current = {
				pointerId: event.pointerId,
				x: event.clientX,
				y: event.clientY,
				startOffset: 0,
				minOffset: 0,
				maxOffset: 0,
				dragging: false,
			};
		};

		const drag = (event: PointerEvent) => {
			const gesture = touch.current;
			if (!gesture || gesture.pointerId !== event.pointerId) return;

			const distance = gesture.x - event.clientX;

			if (!gesture.dragging) {
				if (
					Math.abs(distance) <= Math.max(8, Math.abs(gesture.y - event.clientY))
				)
					return;

				const from = destination.current ?? selected.current;
				const offset = element.scrollLeft;
				const previous = getSlideOffset({ element, index: from - 1 }) ?? offset;
				const next = getSlideOffset({ element, index: from + 1 }) ?? offset;

				gesture.startOffset = offset;
				gesture.minOffset = Math.min(offset, previous, next);
				gesture.maxOffset = Math.max(offset, previous, next);
				gesture.dragging = true;
				element.setPointerCapture(event.pointerId);
				element.style.setProperty("scroll-snap-type", "none");
			}

			element.scrollTo({
				left: Math.min(
					gesture.maxOffset,
					Math.max(gesture.minOffset, gesture.startOffset + distance),
				),
				behavior: "instant",
			});
		};

		const finish = (event: PointerEvent) => {
			const gesture = touch.current;
			if (!gesture || gesture.pointerId !== event.pointerId) return;

			touch.current = null;

			if (!gesture.dragging) return;

			element.style.removeProperty("scroll-snap-type");

			const distance = gesture.x - event.clientX;

			const direction =
				event.type === "pointerup" && Math.abs(distance) >= 24
					? Math.sign(distance) * getDirection(element)
					: 0;

			moveBy(direction);
		};

		element.addEventListener("pointerdown", start);
		element.addEventListener("pointermove", drag);
		element.addEventListener("pointerup", finish);
		element.addEventListener("pointercancel", finish);

		return () => {
			element.removeEventListener("pointerdown", start);
			element.removeEventListener("pointermove", drag);
			element.removeEventListener("pointerup", finish);
			element.removeEventListener("pointercancel", finish);
		};
	}, [swipeMany]);

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
		destination.current = null;
	};

	return (
		<div className={cx("min-w-0", className)}>
			<div
				ref={viewport}
				onPointerDownCapture={swipeMany ? interruptAnimation : undefined}
				onWheelCapture={swipeMany ? interruptAnimation : undefined}
				onKeyDownCapture={interruptAnimation}
				className={cx(
					"flex w-full snap-x snap-mandatory [scrollbar-width:none] items-start overflow-x-auto overflow-y-hidden",
					!swipeMany && "[touch-action:pan-y_pinch-zoom]",
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

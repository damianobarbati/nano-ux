import React from "react";
import * as z from "zod/mini";
import { Button } from "../../components/Button.tsx";
import { Swiper, SwiperPropsSchema } from "../../components/Swiper.tsx";

const days = Array.from({ length: 8 }, (_, index) =>
	new Intl.DateTimeFormat("en", {
		weekday: "short",
		month: "short",
		day: "numeric",
		timeZone: "UTC",
	}).format(Date.UTC(2026, 10, 22 + index)),
);

const CalendarExample = () => {
	const [index, setIndex] = React.useState(0);
	const [counts, setCounts] = React.useState([2, 0, 4, 1, 3, 2, 1, 2]);

	const addLesson = () =>
		setCounts(
			counts.map((count, position) => count + Number(position === index)),
		);

	return (
		<div className="mx-auto grid w-full max-w-md gap-4">
			<div className="flex items-center justify-between gap-2">
				<Button
					variant="outline"
					disabled={index === 0}
					onClick={() => setIndex(index - 1)}
				>
					Previous
				</Button>
				<h2 aria-live="polite">{days[index]}</h2>
				<Button
					variant="outline"
					disabled={index === days.length - 1}
					onClick={() => setIndex(index + 1)}
				>
					Next
				</Button>
			</div>
			<Swiper index={index} onChangeIndex={setIndex} autoHeight>
				{days.map((day, position) => (
					<section
						key={day}
						aria-label={day}
						className="grid gap-2 rounded-card border border-border bg-surface p-4"
					>
						{counts[position] === 0 && <p>No lessons scheduled.</p>}
						{Array.from({ length: counts[position] }, (_, lesson) => (
							<p key={lesson} className="border-b border-border py-3">
								Lesson {lesson + 1}
							</p>
						))}
						<Button onClick={addLesson}>Add lesson</Button>
					</section>
				))}
			</Swiper>
		</div>
	);
};

export const Preview = CalendarExample;
export const layout = "padded";

export const schema = z.pick(SwiperPropsSchema, {
	autoHeight: true,
	swipeMany: true,
});

export const Playground = (props: z.infer<typeof schema>) => (
	<Swiper
		children={[
			<div key="one">First slide</div>,
			<div key="two">Second slide</div>,
		]}
		{...props}
	/>
);

export const section = "Components";

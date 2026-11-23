import type { StoryObj } from "@storybook/react-vite";
import React from "react";
import { expect, waitFor } from "storybook/test";
import { Button } from "../components/Button.tsx";
import { Swiper } from "../components/Swiper.tsx";

export default {
	title: "Components / Swiper",
	component: Swiper,
	parameters: { layout: "padded" },
};

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

export const Default = { name: "Swiper", render: CalendarExample };

export const ScrollSettlement: StoryObj<typeof Swiper> = {
	render: CalendarExample,
	play: async ({ canvas, canvasElement }) => {
		const viewport =
			canvasElement.querySelector<HTMLDivElement>(".snap-mandatory");

		if (!viewport) throw new Error("Missing Swiper viewport");

		viewport.scrollTo({ left: viewport.clientWidth, behavior: "instant" });

		await waitFor(() =>
			expect(canvas.getByRole("heading")).toHaveTextContent(days[1]),
		);

		await expect(canvas.getByRole("region", { name: days[1] })).toBeVisible();
	},
};

export const InterruptedNavigation: StoryObj<typeof Swiper> = {
	render: CalendarExample,
	play: async ({ canvas, canvasElement, userEvent }) => {
		const viewport =
			canvasElement.querySelector<HTMLDivElement>(".snap-mandatory");

		if (!viewport) throw new Error("Missing Swiper viewport");

		await userEvent.click(canvas.getByRole("button", { name: "Next" }));
		viewport.scrollTo({ left: viewport.clientWidth * 3, behavior: "instant" });

		await waitFor(() =>
			expect(canvas.getByRole("heading")).toHaveTextContent(days[3]),
		);
	},
};

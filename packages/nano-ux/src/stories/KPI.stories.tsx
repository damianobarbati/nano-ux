import type { StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { KPI, type KPIProps } from "../components/KPI.tsx";

export default { title: "Components / KPI", component: KPI };

const indicators: KPIProps[] = [
	{
		label: "Requests",
		value: 1240,
		delta: 12.5,
		detail: "This month",
	},
	{ label: "Errors", value: 8, delta: -2 },
	{
		label: "Availability",
		value: 99.9,
		formatAs: "percent",
		delta: 0,
	},
	{
		label: "Response time",
		value: 120,
		format: (value) => `${value.toLocaleString()} ms`,
		variant: "outline",
	},
	{ label: "Active users", value: 12500, formatAs: "number", variant: "ghost" },
	{ label: "Revenue", value: 1250, formatAs: "USD" },
	{ label: "Session length", value: 85, formatAs: "duration" },
];

export const Indicators: StoryObj<typeof KPI> = {
	name: "KPI",
	render: () => (
		<section className="min-w-0">
			<h2>KPI</h2>
			<div className="overflow-x-auto">
				<ul
					aria-label="KPIs"
					className="m-0 grid list-none auto-cols-[minmax(10rem,1fr)] grid-flow-col gap-4 p-0"
				>
					{indicators.map(({ label, ...props }) => (
						<li key={label}>
							<KPI className="h-full" label={label} {...props} />
						</li>
					))}
				</ul>
			</div>
		</section>
	),
	play: async ({ canvas }) => {
		const list = within(canvas.getByRole("list", { name: "KPIs" }));

		await expect(list.getAllByRole("listitem")).toHaveLength(7);

		const requests = list.getByText("Requests").closest("li");

		await expect(requests).toHaveTextContent("+12.5%This month");

		await expect(list.getByText("Errors").closest("li")).toHaveTextContent(
			"-2%",
		);

		const availability = list.getByText("Availability").closest("li");

		await expect(availability).toHaveTextContent("-");
	},
};

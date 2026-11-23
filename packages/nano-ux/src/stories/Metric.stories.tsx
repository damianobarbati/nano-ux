import type { StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";
import { Metric } from "../components/Metric.tsx";

export default { title: "Components / Metric", component: Metric };

export const Variants: StoryObj<typeof Metric> = {
	name: "Metric",
	render: () => (
		<div className="grid gap-4 sm:grid-cols-2">
			<Metric label="Completed verifications" value={2000} suffix="+" />
			<Metric label="Completion rate" value={98.6} decimals={1} suffix="%" />
		</div>
	),
	play: async ({ canvas }) => {
		await waitFor(
			() =>
				expect(
					canvas.getByText("Completion rate").parentElement,
				).toHaveTextContent("98.6%"),
			{ timeout: 3000 },
		);
	},
};

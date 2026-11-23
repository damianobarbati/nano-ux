import type { Meta } from "@storybook/react-vite";
import { WorldMap as WorldMapComponent } from "../components/WorldMap.tsx";

export default {
	title: "Components / WorldMap",
	component: WorldMapComponent,
	parameters: { layout: "centered" },
	decorators: [
		(Story) => (
			<div
				style={{
					width: "min(32rem, calc(100vw - 2rem))",
					aspectRatio: "5 / 3",
				}}
				className="rounded-control border border-border bg-surface"
			>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof WorldMapComponent>;

export const WorldMap = {
	name: "WorldMap",
	args: {
		label: "Traffico per paese",
		data: [
			{ country: "IT", intensity: 80 },
			{ country: "DE", intensity: 45 },
			{ country: "FR", intensity: 10 },
		],
	},
};

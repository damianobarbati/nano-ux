import * as z from "zod/mini";

import {
	WorldMap as WorldMapComponent,
	WorldMapPropsSchema,
} from "../../components/WorldMap.tsx";

const exampleProps = {
	label: "Traffico per paese",
	data: [
		{ country: "IT", intensity: 80 },
		{ country: "DE", intensity: 45 },
		{ country: "FR", intensity: 10 },
	],
};

export const Preview = () => (
	<div className="aspect-[5/3] w-[min(32rem,95vw)] rounded-control border border-border bg-surface">
		<WorldMapComponent {...exampleProps} />
	</div>
);

export const schema = z.pick(WorldMapPropsSchema, { label: true, color: true });
export const defaults = { label: "Traffic by country" };

export const Playground = (props: z.infer<typeof schema>) => (
	<div className="aspect-[5/3] w-96">
		<WorldMapComponent data={exampleProps.data} {...props} />
	</div>
);

export const section = "Components";

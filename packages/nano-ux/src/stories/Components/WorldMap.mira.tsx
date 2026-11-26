import * as z from "zod/mini";

import {
	WorldMap as WorldMapComponent,
	WorldMapPropsSchema,
} from "../../components/WorldMap.tsx";

const exampleProps = {
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

export const schema = WorldMapPropsSchema;
export const defaults = exampleProps;

export const Playground = (props: z.infer<typeof schema>) => (
	<div className="aspect-[5/3] w-96">
		<WorldMapComponent {...props} />
	</div>
);

export const section = "Components";

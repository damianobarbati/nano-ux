import * as z from "zod/mini";

import {
	ChartPie,
	type ChartPieProps,
	ChartPiePropsSchema,
} from "../../components/ChartPie.tsx";

const examples = [
	{
		name: "Normal",
		data: [
			{ name: "Created", value: 18 },
			{ name: "Completed", value: 30 },
			{ name: "Archived", value: 12 },
		],
	},
	{ name: "No data", data: [] },
	{ name: "Loading", data: [], loading: true },
];

const exampleProps = { loading: false, showLegend: true };

const Gallery = ({
	loading,
	showLegend,
}: Pick<ChartPieProps, "loading" | "showLegend">) => (
	<div className="grid w-[min(72rem,calc(100vw-2rem))] gap-4 sm:grid-cols-2">
		{examples.map((example) => (
			<section className="min-w-0" key={example.name}>
				<h2>{example.name}</h2>
				<div className="rounded-control border border-border">
					<ChartPie
						className="h-64 w-full"
						data={example.data}
						loading={loading || example.loading}
						label={example.name}
						showLegend={showLegend}
						valueFormatter={String}
					/>
				</div>
			</section>
		))}
	</div>
);

export const Preview = () => <Gallery {...exampleProps} />;

export const schema = z.pick(ChartPiePropsSchema, {
	loading: true,
	label: true,
	showLegend: true,
});

export const defaults = { label: "Requests" };

export const Playground = (props: z.infer<typeof schema>) => (
	<ChartPie
		data={examples[0].data}
		className="h-64 w-96"
		valueFormatter={String}
		{...props}
	/>
);

export const section = "Components";

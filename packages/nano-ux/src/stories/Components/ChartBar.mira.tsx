import * as z from "zod/mini";
import { ChartBar, ChartBarPropsSchema } from "../../components/ChartBar.tsx";

const data = Array.from({ length: 14 }, (_, index) => ({
	label: `Sep ${index + 1}`,
	values: [index % 5, (index * 3) % 8, index % 3],
}));

const series = [
	{ name: "Created" },
	{ name: "Completed" },
	{ name: "Archived" },
];

const examples = [
	{ name: "Normal", data, series: [{ name: "Created" }] },
	{ name: "No data", data: [], series },
	{ name: "Multi", data, series: series.slice(0, 2), stacked: false },
	{ name: "Stacked", data, series },
	{ name: "Loading", data: [], loading: true, series },
];

const exampleProps = { loading: false };

const Gallery = ({ loading }: { loading: boolean }) => (
	<div
		className="grid grid-cols-2 gap-4"
		style={{ width: "min(72rem, calc(100vw - 2rem))" }}
	>
		{examples.map(({ name, ...props }) => (
			<section className="min-w-0" key={name}>
				<h2>{name}</h2>
				<div className="rounded-control border border-border">
					<ChartBar
						{...props}
						loading={loading || props.loading}
						className="h-64 w-full"
						label={name}
						valueFormatter={String}
					/>
				</div>
			</section>
		))}
	</div>
);

export const Preview = () => <Gallery {...exampleProps} />;

export const schema = z.pick(ChartBarPropsSchema, {
	loading: true,
	label: true,
	stacked: true,
});

export const defaults = { label: "Created" };

export const Playground = (props: z.infer<typeof schema>) => (
	<ChartBar
		data={data}
		series={series}
		className="h-64 w-96"
		valueFormatter={String}
		{...props}
	/>
);

export const section = "Components";

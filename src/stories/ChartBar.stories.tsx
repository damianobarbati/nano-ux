import { ChartBar } from "../components/ChartBar.tsx";

const data = Array.from({ length: 14 }, (_, index) => ({
	label: `Sep ${index + 1}`,
	values: [index % 5, (index * 3) % 8, index % 3],
}));

const series = [
	{ name: "Created" },
	{ name: "Completed" },
	{ name: "Archived" },
];

export default { title: "Components / ChartBar", component: ChartBar };

const examples = [
	{ name: "Normal", data, series: [{ name: "Created" }] },
	{ name: "No data", data: [], series },
	{ name: "Multi", data, series: series.slice(0, 2), stacked: false },
	{ name: "Stacked", data, series },
	{ name: "Loading", data: [], loading: true, series },
];

export const Variants = {
	name: "ChartBar",
	args: { loading: false },
	render: ({ loading }: { loading: boolean }) => (
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
	),
};

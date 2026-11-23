import { ChartPie, type ChartPieProps } from "../components/ChartPie.tsx";

export default { title: "Components / ChartPie", component: ChartPie };

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

export const Variants = {
	name: "ChartPie",
	args: { loading: false, showLegend: true },
	render: ({
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
	),
};

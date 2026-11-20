import { ChartLine } from "../components/ChartLine.tsx";

const data = [
	{ timestamp: "2026-09-21T00:00:00.000Z", values: [12, 8, 5] },
	{ timestamp: "2026-09-22T00:00:00.000Z", values: [19, 13, 9] },
	{ timestamp: "2026-09-23T00:00:00.000Z", values: [14, 17, 4] },
	{ timestamp: "2026-09-24T00:00:00.000Z", values: [25, 12, 10] },
];

const currentSeries = [{ name: "Current period" }];

export default { title: "Components / ChartLine", component: ChartLine };

const examples = [
	{
		name: "Normal",
		data: data.map(({ timestamp, values }) => ({
			timestamp,
			values: [values[0]],
		})),
		series: currentSeries,
	},
	{ name: "No data", data: [], series: currentSeries },
	{
		name: "Multi",
		data,
		series: [{ name: "Direct" }, { name: "Search" }, { name: "Referral" }],
	},
	{
		name: "Multi dotted",
		data: data.map(({ timestamp, values }) => ({
			timestamp,
			values: [values[0], Math.round(values[0] / 2)],
		})),
		series: [
			...currentSeries,
			{ name: "Previous period", lineType: "dotted" as const },
		],
	},
	{ name: "Loading", data: [], series: currentSeries, loading: true },
];

export const Variants = {
	name: "ChartLine",
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
						<ChartLine
							{...props}
							loading={loading || props.loading}
							interval="day"
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

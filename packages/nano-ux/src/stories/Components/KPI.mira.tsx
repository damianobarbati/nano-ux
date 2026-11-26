import * as z from "zod/mini";
import { KPI, type KPIProps, KPIPropsSchema } from "../../components/KPI.tsx";

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

export const Preview = () => (
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
);

export const schema = z.pick(KPIPropsSchema, {
	label: true,
	detail: true,
	delta: true,
	variant: true,
});

export const defaults = { label: "Completed" };

export const Playground = (props: z.infer<typeof schema>) => (
	<KPI value={120} {...props} />
);

export const section = "Components";

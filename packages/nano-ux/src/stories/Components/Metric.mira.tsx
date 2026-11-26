import * as z from "zod/mini";
import { Metric, MetricPropsSchema } from "../../components/Metric.tsx";

export const Preview = () => (
	<div className="grid gap-4 sm:grid-cols-2">
		<Metric label="Completed verifications" value={2000} suffix="+" />
		<Metric label="Completion rate" value={98.6} decimals={1} suffix="%" />
	</div>
);

export const schema = z.pick(MetricPropsSchema, {
	label: true,
	value: true,
	decimals: true,
	suffix: true,
});

export const defaults = { label: "Completion rate", value: 98.6 };

export const Playground = (props: z.infer<typeof schema>) => (
	<Metric {...props} />
);

export const section = "Components";

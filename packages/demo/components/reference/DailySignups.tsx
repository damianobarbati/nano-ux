import { ChartLine } from "nano-ux/charts/line";

type DailySignupsProps = { className?: string };

export const DailySignups = ({ className }: DailySignupsProps) => (
	<ChartLine
		className={className}
		label="Daily signups"
		interval="day"
		series={[{ name: "Signups" }]}
		data={[
			{ timestamp: "2025-09-21T00:00:00Z", values: [12] },
			{ timestamp: "2025-09-22T00:00:00Z", values: [18] },
			{ timestamp: "2025-09-23T00:00:00Z", values: [15] },
			{ timestamp: "2025-09-24T00:00:00Z", values: [23] },
			{ timestamp: "2025-09-25T00:00:00Z", values: [20] },
			{ timestamp: "2025-09-26T00:00:00Z", values: [25] },
			{ timestamp: "2025-09-27T00:00:00Z", values: [19] },
			{ timestamp: "2025-09-28T00:00:00Z", values: [17] },
			{ timestamp: "2025-09-29T00:00:00Z", values: [27] },
			{ timestamp: "2025-09-30T00:00:00Z", values: [30] },
		]}
		valueFormatter={String}
	/>
);

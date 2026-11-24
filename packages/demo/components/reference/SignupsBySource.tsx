import cx from "clsx-tw";
import { Button } from "nano-ux";
import { ChartBar } from "nano-ux/charts/bar";
import React from "react";

type SignupsBySourceProps = { className?: string };

const sources = [
	{ label: "Search", free: 24, paid: 9 },
	{ label: "Referral", free: 18, paid: 12 },
	{ label: "Social", free: 21, paid: 7 },
	{ label: "Email", free: 14, paid: 8 },
	{ label: "Direct", free: 17, paid: 10 },
	{ label: "Events", free: 11, paid: 5 },
];

export const SignupsBySource = ({ className }: SignupsBySourceProps) => {
	const [compare, setCompare] = React.useState(false);
	const series = [{ name: "Free" }];

	if (compare) series.push({ name: "Paid" });

	const data = sources.map(({ label, free, paid }) => ({
		label,
		values: compare ? [free, paid] : [free],
	}));

	return (
		<div className={cx("grid gap-3", className)}>
			<Button
				className="justify-self-start"
				type="button"
				variant="outline"
				aria-pressed={compare}
				onClick={() => setCompare(!compare)}
			>
				Compare paid signups
			</Button>
			<ChartBar
				label="Signups by source"
				series={series}
				data={data}
				stacked={false}
				valueFormatter={String}
			/>
		</div>
	);
};

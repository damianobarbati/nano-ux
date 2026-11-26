import { ChartPie } from "nano-ux";

type SignupsByPlanProps = { className?: string };

export const SignupsByPlan = ({ className }: SignupsByPlanProps) => (
	<ChartPie
		className={className}
		label="Signups by plan"
		data={[
			{ name: "Free", value: 54 },
			{ name: "Pro", value: 30 },
			{ name: "Team", value: 16 },
		]}
		showLegend
		valueFormatter={String}
	/>
);

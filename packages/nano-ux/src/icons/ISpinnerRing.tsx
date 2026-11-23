import type { SVGProps } from "react";

type ISpinnerRingProps = SVGProps<SVGSVGElement>;

export const ISpinnerRing = ({ className, ...props }: ISpinnerRingProps) => (
	<svg
		className={className}
		width="1em"
		height="1em"
		viewBox="0 0 48 48"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		{...props}
	>
		<circle cx="24" cy="24" r="17" strokeOpacity="0.25" />
		<circle
			cx="24"
			cy="24"
			r="20.33"
			pathLength="100"
			strokeDasharray="25 75"
		/>
	</svg>
);

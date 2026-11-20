import type { SVGProps } from "react";

type ISpinnerArcProps = SVGProps<SVGSVGElement>;

export const ISpinnerArc = ({ className, ...props }: ISpinnerArcProps) => (
	<svg
		className={className}
		width="1em"
		height="1em"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		{...props}
	>
		<path d="M12 3a9 9 0 1 0 9 9" />
	</svg>
);

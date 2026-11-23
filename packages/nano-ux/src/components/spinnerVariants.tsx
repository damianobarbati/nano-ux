import cx from "clsx-tw";
import React from "react";

export type SpinnerRendererProps = {
	className: string;
	size: "sm" | "md" | "lg" | "xl";
};

const Artwork = ({
	variant,
	className,
}: {
	variant: string;
	className: string;
}) => {
	const gradientId = React.useId();
	let artwork: React.ReactNode;

	switch (variant) {
		case "arc":
			artwork = (
				<g className="spinner-option-rotate">
					<circle cx="24" cy="24" r="18" strokeOpacity="0.12" />
					<circle
						cx="24"
						cy="24"
						r="18"
						strokeDasharray="72 114"
						strokeLinecap="round"
					/>
				</g>
			);

			break;
		case "comet":
			artwork = (
				<g className="spinner-option-rotate">
					<defs>
						<linearGradient
							id={gradientId}
							x1="6"
							y1="24"
							x2="42"
							y2="24"
							gradientUnits="userSpaceOnUse"
						>
							<stop stopColor="currentColor" stopOpacity="0" />
							<stop offset="1" stopColor="currentColor" />
						</linearGradient>
					</defs>
					<path
						d="M6 24a18 18 0 0 1 36 0"
						stroke={`url(#${gradientId})`}
						strokeLinecap="round"
					/>
					<circle cx="42" cy="24" r="2" fill="currentColor" stroke="none" />
				</g>
			);

			break;
		case "orbit":
			artwork = (
				<g className="spinner-option-rotate">
					<circle cx="24" cy="24" r="17" strokeWidth="1" strokeOpacity="0.2" />
					<circle cx="24" cy="7" r="3.5" fill="currentColor" stroke="none" />
					<circle
						cx="24"
						cy="41"
						r="2"
						fill="currentColor"
						fillOpacity="0.35"
						stroke="none"
					/>
				</g>
			);

			break;
		case "live-pulse":
			artwork = (
				<g className="spinner-option-rotate">
					<circle
						cx="24"
						cy="24"
						r="4"
						fill="currentColor"
						stroke="none"
						className="spinner-option-pulse-core"
					/>
					<circle
						cx="24"
						cy="24"
						r="11"
						strokeOpacity="0.65"
						className="spinner-option-pulse-ring"
					/>
					<circle
						cx="24"
						cy="24"
						r="19"
						strokeOpacity="0.25"
						className="spinner-option-pulse-ring spinner-option-pulse-delay"
					/>
				</g>
			);

			break;
		case "face-scan":
			artwork = (
				<g className="spinner-option-scan">
					<path
						d="M17 8H12a4 4 0 0 0-4 4v5m23-9h5a4 4 0 0 1 4 4v5M8 31v5a4 4 0 0 0 4 4h5m23-9v5a4 4 0 0 1-4 4h-5"
						strokeLinecap="round"
					/>
					<path d="M12 24h24" strokeOpacity="0.5" />
				</g>
			);

			break;
		case "edge-travel":
			artwork = (
				<g>
					<path
						d="M24 8H36a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V12a4 4 0 0 1 4-4H24"
						stroke="currentColor"
						strokeOpacity="0.2"
						strokeLinecap="round"
						pathLength="100"
						strokeWidth="3"
					/>
					<path
						className="spinner-option-edge-flow"
						d="M24 8H36a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V12a4 4 0 0 1 4-4H24"
						stroke="currentColor"
						strokeLinecap="round"
						strokeWidth="4"
						pathLength="100"
					/>
				</g>
			);

			break;
		case "comet-corner-sync":
			artwork = (
				<g>
					<g
						fill="none"
						stroke="currentColor"
						strokeLinecap="round"
						strokeWidth="3"
					>
						<path
							d="M17 8H12a4 4 0 0 0-4 4v5M31 8h5a4 4 0 0 1 4 4v5M8 31v5a4 4 0 0 0 4 4h5M31 40h5a4 4 0 0 0 4-4v-5"
							strokeOpacity="0.2"
						/>
						<path
							d="M8 17v-5a4 4 0 0 1 4-4h5"
							className="spinner-option-corner-pulse spinner-option-corner-4"
							pathLength="100"
						/>
						<path
							d="M31 8h5a4 4 0 0 1 4 4v5"
							className="spinner-option-corner-pulse spinner-option-corner-1"
							pathLength="100"
						/>
						<path
							d="M40 31v5a4 4 0 0 1-4 4h-5"
							className="spinner-option-corner-pulse spinner-option-corner-2"
							pathLength="100"
						/>
						<path
							d="M17 40h-5a4 4 0 0 1-4-4v-5"
							className="spinner-option-corner-pulse spinner-option-corner-3"
							pathLength="100"
						/>
					</g>
					<g
						className="spinner-option-comet-rotate"
						fill="none"
						stroke="currentColor"
						strokeLinecap="round"
						strokeWidth="2.5"
					>
						<path d="M17 24a7 7 0 0 1 14 0" strokeOpacity="0.3" />
						<path d="M24 17a7 7 0 0 1 7 7" />
						<circle cx="31" cy="24" r="1.5" fill="currentColor" stroke="none" />
					</g>
				</g>
			);

			break;
		case "ring-in":
			artwork = (
				<>
					<circle cx="24" cy="24" r="17" strokeWidth="2" strokeOpacity="0.25" />
					<g className="spinner-option-inner-rotate">
						<circle
							cx="24"
							cy="24"
							r="14.17"
							strokeWidth="2"
							pathLength="100"
							strokeDasharray="25 75"
							transform="rotate(90 24 24)"
						/>
					</g>
				</>
			);

			break;
		case "infinity":
			artwork = (
				<svg
					x="0"
					y="0"
					width="48"
					height="48"
					viewBox="0 0 100 100"
					preserveAspectRatio="xMidYMid"
				>
					<path
						className="spinner-option-infinity-flow"
						d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z"
						stroke="currentColor"
						strokeWidth="10"
						strokeLinecap="round"
						strokeDasharray="205.271 51.318"
					/>
				</svg>
			);

			break;
		default:
			artwork = (
				<>
					<circle cx="24" cy="24" r="17" strokeOpacity=".25" />
					<circle
						cx="24"
						cy="24"
						r="20.33"
						pathLength="100"
						strokeDasharray="25 75"
					/>
				</>
			);
	}

	return (
		<svg
			className={cx(
				"spinner-option inline-block shrink-0 overflow-visible",
				variant === "ring-out" && "animate-spin motion-reduce:animate-none",
				className,
			)}
			viewBox="0 0 48 48"
			fill="none"
			stroke="currentColor"
			strokeWidth={variant === "ring-out" ? 2 : 3}
		>
			{artwork}
		</svg>
	);
};

const renderer =
	(variant: string) =>
	({ className }: SpinnerRendererProps) => (
		<Artwork variant={variant} className={className} />
	);

export const spinnerVariants = {
	arc: renderer("arc"),
	comet: renderer("comet"),
	orbit: renderer("orbit"),
	"ring-in": renderer("ring-in"),
	"ring-out": renderer("ring-out"),
	"live-pulse": renderer("live-pulse"),
	"edge-travel": renderer("edge-travel"),
	"face-scan": renderer("face-scan"),
	"comet-corner-sync": renderer("comet-corner-sync"),
	infinity: renderer("infinity"),
};

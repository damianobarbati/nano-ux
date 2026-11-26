"use client";

import React from "react";
import * as z from "zod/mini";

type MapGeometry = typeof import("../assets/worldmap.json");
export type WorldMapData = { country: string; intensity: number };

export const WorldMapPropsSchema = z.object({
	label: z.string(),
	data: z.custom<readonly WorldMapData[]>(),
	strings: z.optional(
		z.object({
			noData: z.optional(z.string()),
			loadError: z.optional(z.string()),
			countryName: z.optional(
				z.custom<(code: string, name: string) => string>(),
			),
		}),
	),
	color: z.optional(z.string()),
});

export type WorldMapProps = z.infer<typeof WorldMapPropsSchema>;

// Simplified Natural Earth 1:50m country boundaries in projected SVG coordinates.
export const WorldMap = ({
	strings,
	label,
	data,
	color = "var(--theme-fg)",
}: WorldMapProps) => {
	const [geometry, setGeometry] = React.useState<MapGeometry>();
	const [loadFailed, setLoadFailed] = React.useState(false);
	const [active, setActive] = React.useState<SVGPathElement | null>(null);
	const tooltip = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		let mounted = true;

		const loadGeometry = async () => {
			try {
				const { default: paths } = await import("../assets/worldmap.ts");

				if (mounted) setGeometry(paths);
			} catch {
				if (mounted) setLoadFailed(true);
			}
		};

		void loadGeometry();

		return () => {
			mounted = false;
		};
	}, []);

	const values = new Map(
		data.map(({ country, intensity }) => [country.toUpperCase(), intensity]),
	);

	const value = active && values.get(active.dataset.code ?? "");

	const moveTooltip = (event: React.PointerEvent<SVGSVGElement>) => {
		const path = event.target instanceof SVGPathElement ? event.target : null;

		setActive(path);

		if (!path || !tooltip.current) return;

		const bounds = event.currentTarget.getBoundingClientRect();
		const x = event.clientX - bounds.left;
		const y = event.clientY - bounds.top;
		const style = tooltip.current.style;

		style.left = x < bounds.width / 2 ? `${x + 12}px` : "auto";
		style.right = x >= bounds.width / 2 ? `${bounds.width - x + 12}px` : "auto";
		style.top = y < bounds.height / 2 ? `${y + 12}px` : "auto";

		style.bottom =
			y >= bounds.height / 2 ? `${bounds.height - y + 12}px` : "auto";
	};

	if (loadFailed)
		return <p>{strings?.loadError ?? `Could not load ${label}.`}</p>;

	return (
		<div style={{ position: "relative", width: "100%", height: "100%" }}>
			<svg
				viewBox="-361 -237 802 405"
				preserveAspectRatio="none"
				style={{ display: "block" }}
				width="100%"
				height="100%"
				className="robinson-map"
				onPointerMove={moveTooltip}
				onPointerLeave={() => setActive(null)}
			>
				{geometry?.map(([code, name, path]) => {
					const intensity = values.get(code);
					return (
						<path
							key={name}
							d={path}
							data-code={code}
							data-name={strings?.countryName?.(code, name) ?? name}
							stroke="var(--theme-surface)"
							strokeWidth={0.55}
							fill={`color-mix(in srgb, ${color} ${Math.max(0, Math.min(100, intensity ?? 0))}%, var(--theme-border))`}
						/>
					);
				})}
			</svg>
			<div ref={tooltip} hidden={!active} className="robinson-tooltip">
				<strong>{active?.dataset.name}</strong>
				<br />
				{value == null
					? (strings?.noData ?? "No data")
					: `${Math.max(0, Math.min(100, value))}%`}
			</div>
		</div>
	);
};

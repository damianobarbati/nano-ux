"use client";

import * as React from "react";
import type { ChartProps } from "./ChartRenderer.tsx";

export type { ChartProps } from "./ChartRenderer.tsx";

const ChartRenderer = React.lazy(() => import("./ChartRenderer.tsx"));

export type ChartSeries = {
	name: string;
	color?: string;
};

export const chartGrid = { left: 45, right: 12, top: 20, bottom: 40 };

export const Chart = (props: ChartProps) => (
	<React.Suspense fallback={<div className={props.className ?? "h-56"} />}>
		<ChartRenderer {...props} />
	</React.Suspense>
);

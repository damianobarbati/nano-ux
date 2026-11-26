"use client";

import cx from "clsx-tw";
import type { EChartsCoreOption, LineSeriesOption } from "echarts";
import React from "react";
import * as z from "zod/mini";
import { Chart, type ChartSeries, chartGrid } from "./Chart.tsx";
import { ChartPlaceholder, type ChartStrings } from "./ChartPlaceholder.tsx";
import { chartSeriesColor, getThemeColor } from "./themeColor.ts";

export type ChartLineData = {
	timestamp: string;
	values: number[];
};

export type ChartLineSeries = ChartSeries & {
	lineType?: "solid" | "dashed" | "dotted";
};

export const ChartLinePropsSchema = z.object({
	strings: z.optional(
		z.custom<ChartStrings & { timestamp?: (timestamp: string) => string }>(),
	),
	className: z.optional(z.string()),
	loading: z.optional(z.boolean()),
	label: z.optional(z.string()),
	data: z.custom<ChartLineData[]>(),
	series: z.custom<ChartLineSeries[]>(),
	interval: z.enum(["hour", "day", "week", "month"]),
	valueFormatter: z.custom<(value: number) => string>(),
});

export type ChartLineProps = z.infer<typeof ChartLinePropsSchema>;

export const ChartLine = ({
	strings,
	className,
	loading = false,
	label = "",
	interval,
	data,
	series,
	valueFormatter,
}: ChartLineProps) => {
	const option = React.useCallback(() => {
		const timestamps = data.map(
			(point) =>
				strings?.timestamp?.(point.timestamp) ??
				new Date(point.timestamp).toLocaleString("en-GB", {
					timeZone: "UTC",
					day: "numeric",
					month: "short",
					...(interval === "hour" ? { hour: "2-digit" } : {}),
				}),
		);

		const lines = series.map(({ name, color, lineType }, index) => {
			const lineColor = getThemeColor(color ?? chartSeriesColor(index));

			const line: LineSeriesOption = {
				name,
				type: "line",
				smooth: 0.3,
				smoothMonotone: "x",
				showSymbol: false,
				itemStyle: { color: lineColor },
				lineStyle: { width: 2, color: lineColor, type: lineType ?? "solid" },
				data: data.map((point) => point.values[index]),
				tooltip: { valueFormatter: (value) => valueFormatter(Number(value)) },
			};

			if (index === 0) line.areaStyle = { color: lineColor, opacity: 0.1 };

			return line;
		});

		const result: EChartsCoreOption = {
			animation: true,
			animationDuration: 0,
			animationDurationUpdate: 450,
			animationEasingUpdate: "cubicOut",
			textStyle: {
				fontFamily: getComputedStyle(document.documentElement).fontFamily,
			},
			grid: chartGrid,
			tooltip: {
				trigger: "axis",
				renderMode: "richText",
				backgroundColor: getThemeColor("--theme-surface"),
				borderColor: getThemeColor("--theme-border"),
				textStyle: { color: getThemeColor("--theme-fg") },
			},
			yAxis: {
				type: "value",
				min: 0,
				splitNumber: 6,
				axisLabel: { color: getThemeColor("--theme-fg-muted") },
				splitLine: { lineStyle: { color: getThemeColor("--theme-border") } },
			},
			xAxis: {
				type: "category",
				boundaryGap: false,
				axisLine: { lineStyle: { color: getThemeColor("--theme-border") } },
				axisLabel: { color: getThemeColor("--theme-fg-muted"), margin: 15 },
				data: timestamps,
			},
			series: lines,
		};

		return result;
	}, [data, series, interval, valueFormatter, strings?.timestamp]);

	if (loading || data.length === 0) {
		return (
			<ChartPlaceholder
				strings={strings}
				className={className}
				label={label}
				loading={loading}
			/>
		);
	}

	return (
		<div className={cx("relative h-56", className)}>
			<Chart label={label} className="h-full w-full" option={option} />
		</div>
	);
};

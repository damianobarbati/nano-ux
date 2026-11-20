"use client";

import * as React from "react";
import { Chart, type ChartSeries, chartGrid } from "./Chart.tsx";
import { ChartPlaceholder } from "./ChartPlaceholder.tsx";
import { chartSeriesColor, getThemeColor } from "./themeColor.ts";

export type ChartBarData = {
	label: string;
	values: number[];
};

export type ChartBarSeries = ChartSeries;

export type ChartBarProps = {
	className?: string;
	loading?: boolean;
	data: ChartBarData[];
	label: string;
	series: ChartBarSeries[];
	stacked?: boolean;
	valueFormatter: (value: number) => string;
};

export const ChartBar = ({
	className,
	loading = false,
	data,
	label,
	series,
	stacked = true,
	valueFormatter,
}: ChartBarProps) => {
	const option = React.useCallback(
		() => ({
			animationDuration: 250,
			grid: chartGrid,
			tooltip: {
				trigger: "axis" as const,
				valueFormatter,
				backgroundColor: getThemeColor("--theme-surface"),
				borderWidth: 0,
				textStyle: { color: getThemeColor("--theme-fg") },
			},
			xAxis: {
				type: "category" as const,
				data: data.map((point) => point.label),
				axisLabel: {
					color: getThemeColor("--theme-fg-muted"),
					fontSize: 12,
					margin: 15,
				},
				axisLine: { lineStyle: { color: getThemeColor("--theme-border") } },
				axisTick: { show: false },
			},
			yAxis: {
				type: "value" as const,
				minInterval: 1,
				axisLabel: { color: getThemeColor("--theme-fg-muted"), fontSize: 11 },
				splitLine: {
					lineStyle: {
						color: getThemeColor("--theme-border"),
						type: "dashed" as const,
					},
				},
			},
			series: series.map(({ name, color }, index) => ({
				name,
				type: "bar" as const,
				stack: stacked ? "activity" : undefined,
				barMaxWidth: 18,
				data: data.map((point) => point.values[index]),
				itemStyle: { color: getThemeColor(color ?? chartSeriesColor(index)) },
			})),
		}),
		[data, series, stacked, valueFormatter],
	);

	if (loading || data.length === 0) {
		return (
			<ChartPlaceholder className={className} label={label} loading={loading} />
		);
	}

	return <Chart className={className} label={label} option={option} />;
};

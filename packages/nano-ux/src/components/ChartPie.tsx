"use client";

import cx from "clsx-tw";
import * as React from "react";
import * as z from "zod/mini";
import { Chart } from "./Chart.tsx";
import { ChartPlaceholder, type ChartStrings } from "./ChartPlaceholder.tsx";
import { getThemeColor } from "./themeColor.ts";

export type ChartPieData = {
	name: string;
	value: number;
};

export const ChartPiePropsSchema = z.object({
	className: z.optional(z.string()),
	data: z.custom<ChartPieData[]>(),
	label: z.string(),
	loading: z.optional(z.boolean()),
	showLegend: z.optional(z.boolean()),
	strings: z.optional(z.custom<ChartStrings>()),
	valueFormatter: z.custom<(value: number) => string>(),
});

export type ChartPieProps = z.infer<typeof ChartPiePropsSchema>;

export const ChartPie = ({
	className,
	data,
	label,
	loading = false,
	showLegend = false,
	strings,
	valueFormatter,
}: ChartPieProps) => {
	const option = React.useCallback(() => {
		const fontSize = Number.parseFloat(
			getComputedStyle(document.body).fontSize,
		);

		const textStyle = { color: getThemeColor("--theme-fg"), fontSize };
		let legend;

		if (showLegend) {
			const total = data.reduce((sum, slice) => sum + slice.value, 0);

			const percent = new Intl.NumberFormat(undefined, {
				style: "percent",
				maximumFractionDigits: 1,
			});

			const labels = new Map(
				data.map(({ name, value }) => [
					name,
					`${name}  ${percent.format(total > 0 ? value / total : 0)}`,
				]),
			);

			legend = {
				type: "scroll",
				orient: "vertical",
				top: "middle",
				left: "50%",
				padding: [0, 0, 0, 12],
				width: "45%",
				icon: "circle",
				selectedMode: false,
				textStyle,
				pageTextStyle: textStyle,
				formatter: (name: string) => labels.get(name) ?? name,
			};
		}

		const result = {
			legend,
			tooltip: {
				trigger: "item",
				valueFormatter,
				backgroundColor: getThemeColor("--theme-surface"),
				borderWidth: 0,
				textStyle,
			},
			series: [
				{
					type: "pie",
					right: showLegend ? "50%" : 0,
					radius: showLegend ? "94%" : "65%",
					stillShowZeroSum: false,
					label: {
						show: !showLegend,
						color: getThemeColor("--theme-fg-muted"),
						fontSize,
					},
					data,
				},
			],
		};

		return result;
	}, [data, showLegend, valueFormatter]);

	if (loading || data.length === 0) {
		return (
			<ChartPlaceholder
				className={className}
				label={label}
				loading={loading}
				strings={strings}
			/>
		);
	}

	if (showLegend) {
		return (
			<div className={cx(className ?? "h-56", "[container-type:size]")}>
				<Chart
					className="mx-auto h-full w-full max-w-[145cqh]"
					label={label}
					option={option}
				/>
			</div>
		);
	}

	return <Chart className={className} label={label} option={option} />;
};

"use client";

import { BarChart, LineChart, PieChart } from "echarts/charts";

import {
	GridComponent,
	LegendComponent,
	TooltipComponent,
} from "echarts/components";

import { type EChartsCoreOption, init, use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import * as React from "react";

use([
	BarChart,
	LineChart,
	PieChart,
	GridComponent,
	LegendComponent,
	TooltipComponent,
	CanvasRenderer,
]);

export type ChartProps = {
	className?: string;
	label?: string;
	onSelect?: (name: string) => void;
	option: () => EChartsCoreOption;
};

const ChartRenderer = ({ className, label, onSelect, option }: ChartProps) => {
	const container = React.useRef<HTMLDivElement>(null);
	const chart = React.useRef<ReturnType<typeof init> | null>(null);
	const optionRef = React.useRef(option);
	const onSelectRef = React.useRef(onSelect);

	React.useEffect(() => {
		if (!container.current) return;

		const element = container.current;

		const handleClick = (event: { name?: string }) => {
			const select = onSelectRef.current;
			if (event.name && select) select(event.name);
		};

		const observer = new ResizeObserver(() => {
			const { width, height } = element.getBoundingClientRect();
			if (width === 0 || height === 0) return;

			if (!chart.current) {
				chart.current = init(element, {
					textStyle: { fontFamily: getComputedStyle(element).fontFamily },
				});

				chart.current.setOption(optionRef.current(), { notMerge: true });
				chart.current.on("click", handleClick);
				return;
			}

			chart.current.resize();
		});

		const themeObserver = new MutationObserver(() => {
			if (chart.current)
				chart.current.setOption(optionRef.current(), { notMerge: true });
		});

		const media = window.matchMedia("(prefers-color-scheme: dark)");

		const updateTheme = () => {
			if (chart.current)
				chart.current.setOption(optionRef.current(), { notMerge: true });
		};

		media.addEventListener("change", updateTheme);
		observer.observe(element);

		themeObserver.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class", "style"],
		});

		return () => {
			observer.disconnect();
			themeObserver.disconnect();
			media.removeEventListener("change", updateTheme);

			if (chart.current) {
				chart.current.off("click", handleClick);
				chart.current.dispose();
				chart.current = null;
			}
		};
	}, []);

	React.useEffect(() => {
		optionRef.current = option;
		onSelectRef.current = onSelect;

		const instance = chart.current;
		if (!instance) return;

		instance.setOption(option(), { notMerge: true });
	}, [onSelect, option]);

	return (
		<div
			className={className}
			ref={container}
			role={label ? "img" : undefined}
			aria-label={label}
		/>
	);
};

export default ChartRenderer;

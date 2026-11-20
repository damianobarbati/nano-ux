export const getThemeColor = (
	color: string,
	root: HTMLElement = document.body,
) => {
	const probe = document.createElement("span");

	probe.style.color = color.startsWith("--") ? `var(${color})` : color;
	root.append(probe);

	const resolvedColor = getComputedStyle(probe).color;

	probe.remove();
	return resolvedColor;
};

export function chartSeriesColor(index: number) {
	if (index === 0) return "var(--color-brand, var(--theme-fg))";
	return index % 2 === 1 ? "--theme-success" : "--theme-danger";
}

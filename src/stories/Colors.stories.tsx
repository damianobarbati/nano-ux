import React from "react";
import { Button, cx } from "../components/Button.tsx";
import { ICard } from "../icons.tsx";

type Swatch = {
	name: string;
	token: string;
	className: string;
	property: "backgroundColor" | "borderColor" | "color";
	sampleText?: string;
	tokenLabel?: string;
	showValue?: boolean;
};

type ProductColor = Swatch;

const foundationColors: Swatch[] = [
	{
		name: "Background",
		token: "bg",
		className: "bg-bg text-fg",
		property: "backgroundColor",
		sampleText: "Aa",
	},
	{
		name: "Surface",
		token: "surface",
		className: "bg-surface text-fg",
		property: "backgroundColor",
		sampleText: "Aa",
	},
	{
		name: "Layer",
		token: "layer",
		className: "bg-layer text-fg",
		property: "backgroundColor",
		sampleText: "Aa",
	},
	{
		name: "Border",
		token: "border",
		className: "border-4 border-border bg-bg",
		property: "borderColor",
	},
	{
		name: "Focus",
		token: "focus",
		className: "bg-focus",
		property: "backgroundColor",
	},
	{
		name: "Foreground",
		token: "fg",
		className: "bg-fg text-fg invert",
		property: "backgroundColor",
	},
	{
		name: "Muted",
		token: "fg-muted",
		className: "bg-bg text-fg-muted",
		property: "color",
		sampleText: "Aa",
	},
];

const productColors: ProductColor[] = [
	{
		name: "Cocoa",
		token: "cocoa",
		className: "bg-cocoa",
		property: "backgroundColor",
	},
	{
		name: "Mint",
		token: "mint",
		className: "bg-mint",
		property: "backgroundColor",
	},
	{
		name: "Lime",
		token: "lime",
		className: "bg-lime",
		property: "backgroundColor",
	},
	{
		name: "Cyan",
		token: "cyan",
		className: "bg-cyan",
		property: "backgroundColor",
	},
	{
		name: "Ocean",
		token: "ocean",
		className: "bg-ocean",
		property: "backgroundColor",
	},
	{
		name: "Violet",
		token: "violet",
		className: "bg-violet",
		property: "backgroundColor",
	},
	{
		name: "Berry",
		token: "berry",
		className: "bg-berry",
		property: "backgroundColor",
	},
];

const productColorStyles: Record<
	string,
	{
		tintedCard: string;
		neutralCard: string;
		accent: string;
		tint: string;
		border: string;
	}
> = {
	cocoa: {
		tintedCard: "bg-cocoa-tint border-cocoa",
		neutralCard: "bg-bg border-cocoa",
		accent: "text-cocoa",
		tint: "bg-cocoa-tint",
		border: "border-cocoa",
	},
	mint: {
		tintedCard: "bg-mint-tint border-mint",
		neutralCard: "bg-bg border-mint",
		accent: "text-mint",
		tint: "bg-mint-tint",
		border: "border-mint",
	},
	lime: {
		tintedCard: "bg-lime-tint border-lime",
		neutralCard: "bg-bg border-lime",
		accent: "text-lime",
		tint: "bg-lime-tint",
		border: "border-lime",
	},
	cyan: {
		tintedCard: "bg-cyan-tint border-cyan",
		neutralCard: "bg-bg border-cyan",
		accent: "text-cyan",
		tint: "bg-cyan-tint",
		border: "border-cyan",
	},
	violet: {
		tintedCard: "bg-violet-tint border-violet",
		neutralCard: "bg-bg border-violet",
		accent: "text-violet",
		tint: "bg-violet-tint",
		border: "border-violet",
	},
	berry: {
		tintedCard: "bg-berry-tint border-berry",
		neutralCard: "bg-bg border-berry",
		accent: "text-berry",
		tint: "bg-berry-tint",
		border: "border-berry",
	},
	ocean: {
		tintedCard: "bg-ocean-tint border-ocean",
		neutralCard: "bg-bg border-ocean",
		accent: "text-ocean",
		tint: "bg-ocean-tint",
		border: "border-ocean",
	},
};

const semanticColors: Swatch[] = [
	{
		name: "Success",
		token: "success",
		className: "bg-success",
		property: "backgroundColor",
	},
	{
		name: "Success surface",
		token: "success-surface",
		className: "bg-success-surface",
		property: "backgroundColor",
	},
	{
		name: "Warning",
		token: "warning",
		className: "bg-warning",
		property: "backgroundColor",
	},
	{
		name: "Warning surface",
		token: "warning-surface",
		className: "bg-warning-surface",
		property: "backgroundColor",
	},
	{
		name: "Danger",
		token: "danger",
		className: "bg-danger",
		property: "backgroundColor",
	},
	{
		name: "Danger surface",
		token: "danger-surface",
		className: "bg-danger-surface",
		property: "backgroundColor",
	},
];

const formatRgb = (value: string) => {
	const matches = value.match(/[\d.]+/g);
	if (!matches || matches.length < 3) return value;

	const channels = matches.slice(0, 3).map((channel) => Number(channel) / 255);
	return `#${channels
		.map((channel) =>
			Math.round(channel * 255)
				.toString(16)
				.padStart(2, "0"),
		)
		.join("")
		.toUpperCase()}`;
};

const TokenSwatch = ({
	name,
	token,
	tokenLabel,
	sampleText,
	className,
	property,
	showValue = true,
}: Swatch) => {
	const swatch = React.useRef<HTMLDivElement>(null);
	const [value, setValue] = React.useState("");

	React.useEffect(() => {
		const element = swatch.current;
		if (!element) return;

		const computedStyle = getComputedStyle(element);

		setValue(formatRgb(computedStyle[property]));
	}, [property]);

	return (
		<div className="grid w-full gap-2">
			<div
				aria-hidden={!sampleText}
				className={cx(
					"grid h-14 w-full place-items-center rounded-control",
					sampleText && "font-semibold",
					className,
				)}
				ref={swatch}
			>
				{sampleText}
			</div>
			<span className="text-sm">{name}</span>
			<div className="flex items-baseline justify-between gap-3 text-xs text-fg-muted">
				<code>{tokenLabel ?? token}</code>
				{showValue && <code>{value}</code>}
			</div>
		</div>
	);
};

const ProductColorSample = ({ color }: { color: ProductColor }) => {
	const swatch = React.useRef<HTMLDivElement>(null);
	const [value, setValue] = React.useState("");

	React.useEffect(() => {
		const element = swatch.current;
		if (!element) return;

		const computedStyle = getComputedStyle(element);

		setValue(formatRgb(computedStyle.backgroundColor));
	}, []);

	return (
		<div className="grid content-start gap-2">
			<span className="min-h-5 text-sm">{color.name}</span>
			<div
				aria-hidden="true"
				className={cx("h-14 rounded-control", color.className)}
				ref={swatch}
			/>
			<div className="flex items-baseline justify-between gap-3 text-xs text-fg-muted">
				<code>{color.token}</code>
				<code>{value}</code>
			</div>
		</div>
	);
};

const TokenGrid = ({
	colors,
	className,
	itemClassName,
	fixedColumns,
}: {
	colors: Swatch[];
	className?: string;
	itemClassName?: string;
	fixedColumns?: 5 | 6;
}) => {
	let gridClassName =
		"grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 lg:grid-cols-5";

	if (fixedColumns === 5) gridClassName = "grid grid-cols-5 gap-x-6 gap-y-6";

	if (fixedColumns === 6) gridClassName = "grid grid-cols-6 gap-x-6 gap-y-6";

	return (
		<div className={cx(gridClassName, className)}>
			{colors.map((color) => (
				<div className={itemClassName} key={color.token}>
					<TokenSwatch {...color} />
				</div>
			))}
		</div>
	);
};

const ProductSelectorCard = ({
	color,
	treatment,
}: {
	color: ProductColor;
	treatment: "tinted" | "neutral";
}) => {
	const styles = productColorStyles[color.token];
	return (
		<article
			className={cx(
				"flex min-h-56 flex-col items-start gap-4 rounded-card border border-border p-5",
				treatment === "tinted" ? styles.tintedCard : styles.neutralCard,
			)}
		>
			<ICard aria-hidden="true" className={cx("size-6", styles.accent)} />
			<h4 className="text-lg">Project details</h4>
			<p className="text-sm text-fg">
				Verify customer identities with secure document checks.
			</p>
			<Button
				className={cx("border-current bg-transparent", styles.accent)}
				size="sm"
				variant="ghost"
			>
				Select
			</Button>
		</article>
	);
};

const ProductSelectorExamples = ({ colors }: { colors: ProductColor[] }) => (
	<div className="mt-6 grid gap-x-6 gap-y-5">
		{colors.map((color) => (
			<div
				className="grid gap-x-6 gap-y-3 lg:grid-cols-[minmax(10rem,0.7fr)_2fr]"
				key={color.token}
			>
				<ProductColorSample color={color} />
				<div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
					<div className="grid gap-x-6 gap-y-2">
						<span className="text-sm text-fg-muted">Neutral surface</span>
						<ProductSelectorCard color={color} treatment="neutral" />
					</div>
					<div className="grid gap-x-6 gap-y-2">
						<span className="text-sm text-fg-muted">Tinted hover</span>
						<ProductSelectorCard color={color} treatment="tinted" />
					</div>
				</div>
			</div>
		))}
	</div>
);

const ContrastPair = ({
	label,
	foregroundClass,
	backgroundClass,
	borderClass,
}: {
	label: string;
	foregroundClass: string;
	backgroundClass: string;
	borderClass?: string;
}) => {
	return (
		<div className="grid gap-2">
			<div
				aria-hidden="true"
				className={cx(
					"grid h-14 place-items-center rounded-control font-semibold",
					backgroundClass,
					foregroundClass,
					borderClass && "border",
					borderClass,
				)}
			>
				Aa
			</div>
			<span className="text-sm">{label}</span>
		</div>
	);
};

const ThemePanel = ({ mode }: { mode: "light" | "dark" }) => {
	return (
		<section
			className={cx(
				"theme-panel",
				mode === "light" ? "theme-panel-light" : "theme-panel-dark",
				mode === "light" ? "light" : "dark",
				"grid content-start gap-10 border border-border bg-bg p-6 text-fg",
			)}
		>
			<header className="flex items-baseline justify-between gap-4">
				<h2>{mode === "light" ? "Light theme" : "Dark theme"}</h2>
			</header>

			<section className="grid gap-4">
				<h3>Core colors</h3>
				<TokenGrid
					colors={foundationColors.slice(0, 5)}
					className="gap-x-6"
					itemClassName="w-full"
					fixedColumns={5}
				/>
				<TokenGrid
					colors={foundationColors.slice(5)}
					className="gap-x-6"
					itemClassName="w-full"
					fixedColumns={5}
				/>
			</section>

			<section className="grid gap-4">
				<h3>Semantic colors</h3>
				<TokenGrid colors={semanticColors} fixedColumns={6} />
			</section>

			<section className="grid gap-4">
				<h3>Contrast</h3>
				<div className="grid grid-cols-5 gap-x-6 gap-y-2">
					<ContrastPair
						label="Text on background"
						foregroundClass="text-fg"
						backgroundClass="bg-bg"
					/>
					<ContrastPair
						label="Text muted on background"
						foregroundClass="text-fg-muted"
						backgroundClass="bg-bg"
					/>
					<ContrastPair
						label="Success on background"
						foregroundClass="text-success"
						backgroundClass="bg-bg"
					/>
					<ContrastPair
						label="Warning on background"
						foregroundClass="text-warning"
						backgroundClass="bg-bg"
					/>
					<ContrastPair
						label="Danger on background"
						foregroundClass="text-danger"
						backgroundClass="bg-bg"
					/>
				</div>
				<div className="grid grid-cols-5 gap-x-6 gap-y-2">
					<ContrastPair
						label="Inverse"
						foregroundClass="text-fg invert"
						backgroundClass="bg-fg"
					/>
					<ContrastPair
						label="Muted on foreground"
						foregroundClass="text-bg/70"
						backgroundClass="bg-fg"
					/>
					<ContrastPair
						label="Success on success surface"
						foregroundClass="text-success"
						backgroundClass="bg-success-surface"
					/>
					<ContrastPair
						label="Warning on warning surface"
						foregroundClass="text-warning"
						backgroundClass="bg-warning-surface"
					/>
					<ContrastPair
						label="Danger on danger surface"
						foregroundClass="text-danger"
						backgroundClass="bg-danger-surface"
					/>
				</div>
			</section>

			<section className="grid gap-4">
				<h3>Colors</h3>
				<TokenGrid colors={productColors} fixedColumns={6} />
				<div className="grid grid-cols-6 gap-x-6 gap-y-2">
					{productColors.map((color) => {
						const styles = productColorStyles[color.token];
						return (
							<ContrastPair
								key={color.token}
								label={`${color.name} on ${color.name} tint`}
								foregroundClass={styles.accent}
								backgroundClass={styles.tint}
								borderClass={styles.border}
							/>
						);
					})}
				</div>
				<ProductSelectorExamples colors={productColors} />
			</section>
		</section>
	);
};

const meta = {
	title: "Foundation / Colors",
	parameters: { layout: "fullscreen" },
};

export default meta;

export const Colors = {
	render: () => (
		<main className="grid min-h-screen gap-8 bg-bg p-5 text-fg lg:p-8">
			<div className="theme-panels grid grid-cols-2 items-start">
				<ThemePanel mode="light" />
				<ThemePanel mode="dark" />
			</div>
		</main>
	),
};

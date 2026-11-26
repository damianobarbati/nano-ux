import React from "react";
import { Button, cx } from "../../components/Button.tsx";
import { ICard } from "../../icons.tsx";
import { productColors } from "../../productColors.ts";

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

const productSwatches = productColors.map((token): ProductColor => {
	const color: ProductColor = {
		name: token[0].toUpperCase() + token.slice(1),
		token,
		className: `bg-${token}`,
		property: "backgroundColor",
	};

	return color;
});

const getProductColorStyles = ({ token }: ProductColor) => {
	const accent = `text-${token}`;
	const border = `border-${token}`;
	const tint = `bg-${token}-tint`;

	const styles = {
		accent,
		border,
		tint,
		tintedCard: cx(tint, border),
		neutralCard: cx("bg-bg", border),
		tintedAccent:
			token === "lime"
				? "text-[color:light-dark(var(--color-fg),var(--color-lime))]"
				: accent,
		contrastLabel: token === "lime" ? "Text on Lime tint" : undefined,
	};

	return styles;
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
			<div className="flex flex-wrap items-baseline justify-between gap-x-2 text-xs text-fg-muted">
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
			<div className="flex flex-wrap items-baseline justify-between gap-x-2 text-xs text-fg-muted">
				<code>{color.token}</code>
				<code>{value}</code>
			</div>
		</div>
	);
};

const swatchGrid =
	"grid grid-cols-[repeat(auto-fit,minmax(min(100%,7rem),1fr))] gap-4";

const TokenGrid = ({ colors }: { colors: Swatch[] }) => (
	<div className={swatchGrid}>
		{colors.map((color) => (
			<TokenSwatch key={color.token} {...color} />
		))}
	</div>
);

const ProductSelectorCard = ({
	className,
	accentClass,
}: {
	className?: string;
	accentClass: string;
}) => {
	return (
		<article
			className={cx(
				"flex min-h-56 flex-col items-start gap-4 rounded-card border border-border p-5",
				className,
			)}
		>
			<ICard aria-hidden="true" className={cx("size-6", accentClass)} />
			<h4 className="text-lg">Project details</h4>
			<p className="text-sm">
				Verify customer identities with secure document checks.
			</p>
			<Button
				className={cx("border-current bg-transparent", accentClass)}
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
		{colors.map((color) => {
			const styles = getProductColorStyles(color);

			return (
				<div
					className="grid gap-x-6 gap-y-3 @4xl:grid-cols-[minmax(10rem,0.7fr)_2fr]"
					key={color.token}
				>
					<ProductColorSample color={color} />
					<div className="grid gap-x-6 gap-y-3 @lg:grid-cols-2">
						<div className="grid gap-x-6 gap-y-2">
							<span className="text-sm text-fg-muted">Neutral surface</span>
							<ProductSelectorCard
								className={styles.neutralCard}
								accentClass={styles.accent}
							/>
						</div>
						<div className="grid gap-x-6 gap-y-2">
							<span className="text-sm text-fg-muted">Tinted hover</span>
							<ProductSelectorCard
								className={styles.tintedCard}
								accentClass={styles.tintedAccent ?? styles.accent}
							/>
						</div>
					</div>
				</div>
			);
		})}
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
				mode,
				"@container grid min-w-0 content-start gap-10 bg-bg p-2 text-fg sm:p-4 lg:p-6",
			)}
		>
			<header className="flex items-baseline justify-between gap-4">
				<h2>{mode === "light" ? "Light theme" : "Dark theme"}</h2>
			</header>

			<section className="grid gap-4">
				<h3>Core colors</h3>
				<TokenGrid colors={foundationColors} />
			</section>

			<section className="grid gap-4">
				<h3>Semantic colors</h3>
				<TokenGrid colors={semanticColors} />
			</section>

			<section className="grid gap-4">
				<h3>Contrast</h3>
				<div className={swatchGrid}>
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
				<div className={swatchGrid}>
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
				<TokenGrid colors={productSwatches} />
				<div className={swatchGrid}>
					{productSwatches.map((color) => {
						const styles = getProductColorStyles(color);

						return (
							<ContrastPair
								key={color.token}
								label={
									styles.contrastLabel ?? `${color.name} on ${color.name} tint`
								}
								foregroundClass={styles.tintedAccent ?? styles.accent}
								backgroundClass={styles.tint}
								borderClass={styles.border}
							/>
						);
					})}
				</div>
				<ProductSelectorExamples colors={productSwatches} />
			</section>
		</section>
	);
};

export const Preview = () => (
	<main className="grid min-h-screen grid-cols-2">
		<ThemePanel mode="light" />
		<ThemePanel mode="dark" />
	</main>
);

export const layout = "fullscreen";

export const section = "Foundation";

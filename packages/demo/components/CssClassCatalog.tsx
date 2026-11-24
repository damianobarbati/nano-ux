import cx from "clsx-tw";
import React from "react";

type CssClassCatalogProps = { className?: string };

const cards = [
	{
		name: "card",
		classes: "card",
		description: "Filled surface with padding.",
	},
	{
		name: "card-shell",
		classes: "card-shell",
		description: "Filled frame without padding.",
	},
	{
		name: "card-outline",
		classes: "card-outline",
		description: "Transparent surface with a border.",
	},
	{
		name: "card-ghost",
		classes: "card-ghost",
		description: "Transparent surface and border.",
	},
	{
		name: "card-tint",
		classes: "card card-tint",
		description: "Tinted card using the theme accent by default.",
	},
];

const tints = [
	"tint-cocoa",
	"tint-mint",
	"tint-mintlight",
	"tint-lime",
	"tint-cyan",
	"tint-ocean",
	"tint-violet",
	"tint-berry",
];

const glows: { name: string; tint?: string }[] = [
	{ name: "glow" },
	...tints.map((tint) => ({ name: tint.replace(/^tint-/, "glow-"), tint })),
];

const colorGridClassName =
	"m-0 mt-3 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4";

const colorSampleClassName =
	"card card-tint grid min-w-0 place-items-center p-3";

const styles = [
	{
		id: "reference-css-typography",
		entries: [
			["typo-lg", "Use the larger type scale."],
			["prose", "Limit text width to 60ch."],
			["heading-hero", "Use the responsive hero size on an h1."],
			[
				"text-box-trim",
				"Trim space to the capital letter height and baseline.",
			],
			["trim-ex", "Trim space to the lowercase x-height and baseline."],
		],
	},
	{
		id: "reference-css-theme-modes",
		entries: [
			["light", "Set the light color scheme."],
			["dark", "Set the dark color scheme."],
			["invert", "Swap the theme foreground and background colors."],
		],
	},
	{
		id: "reference-css-theme-utilities",
		entries: [
			["bg-surface", "Use the theme surface color as a background."],
			["text-fg-muted", "Use the muted text color."],
			["border-border", "Use the theme border color."],
			["rounded-card", "Use the theme card radius."],
		],
	},
];

const sections = [
	{
		id: "reference-css-cards",
		names: cards.map(({ name }) => name),
		content: (
			<ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
				{cards.map(({ name, classes, description }) => (
					<li key={name} className="grid min-w-0 grid-rows-[1fr_auto] gap-2">
						<div className={cx("min-h-20", classes)}>
							<code>{`.${name}`}</code>
						</div>
						<p className="text-sm text-fg-muted">{description}</p>
					</li>
				))}
			</ul>
		),
	},
	{
		id: "reference-css-tints",
		names: tints,
		content: (
			<>
				<p>
					Add a tint class to <code>.card-tint</code> to set its color.
				</p>
				<ul className={colorGridClassName}>
					{tints.map((name) => (
						<li key={name} className={cx(colorSampleClassName, name)}>
							<code>{`.${name}`}</code>
						</li>
					))}
				</ul>
			</>
		),
	},
	{
		id: "reference-css-glows",
		names: glows.map(({ name }) => name),
		content: (
			<>
				<p>
					Use <code>.glow</code> or <code>.glow-*</code> to add a glow with the
					theme accent or a theme color.
				</p>
				<ul className={colorGridClassName}>
					{glows.map(({ name, tint }) => (
						<li key={name} className={cx(colorSampleClassName, name, tint)}>
							<code>{`.${name}`}</code>
						</li>
					))}
				</ul>
			</>
		),
	},
	{
		id: "reference-css-anchor",
		names: ["anchor"],
		content: (
			<p>
				Use <code>.anchor</code> to underline a link, as in{" "}
				<a className="anchor" href="#typography">
					Typography
				</a>
				.
			</p>
		),
	},
	...styles.map(({ id, entries }) => ({
		id,
		names: entries.map(([name]) => name),
		content: (
			<dl className="mt-3 grid gap-3">
				{entries.map(([name, description]) => (
					<div key={name}>
						<dt>
							<code>{`.${name}`}</code>
						</dt>
						<dd className="text-sm text-fg-muted">{description}</dd>
					</div>
				))}
			</dl>
		),
	})),
];

const cssReferences = sections.map(({ id, names, content }) => ({
	id,
	kind: "CSS",
	title: names.map((name) => `.${name}`).join(", "),
	content,
}));

export const cssReferenceLinks = cssReferences.map(({ id, kind, title }) => ({
	id,
	kind,
	title,
}));

export const CssClassCatalog = ({ className }: CssClassCatalogProps) => {
	return (
		<section
			id="reference-classes"
			className={cx("grid min-w-0 scroll-mt-6 gap-8", className)}
			aria-label="CSS classes"
		>
			{cssReferences.map(({ id, kind, title, content }) => (
				<article key={id} id={id} className="min-w-0 scroll-mt-6">
					<h3 className="mb-3">
						<span className="reference-kind">{kind}</span> {title}
					</h3>
					{content}
				</article>
			))}
		</section>
	);
};

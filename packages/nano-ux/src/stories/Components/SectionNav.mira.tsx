import React from "react";
import * as z from "zod/mini";

import {
	SectionNav,
	type SectionNavProps,
	SectionNavPropsSchema,
} from "../../components/SectionNav.tsx";

const exampleProps = {
	currentHref: "#overview",
	sections: [
		{
			id: "start",
			title: "Start here",
			items: [{ label: "Overview", href: "#overview" }],
		},
		{
			id: "foundation",
			title: "Foundation",
			collapsible: true,
			items: [
				{ label: "Typography", href: "#typography" },
				{ label: "Spacing", href: "#spacing" },
			],
		},
		{
			id: "controls",
			title: "Controls",
			collapsible: true,
			defaultExpanded: false,
			items: [{ label: "Buttons", href: "#buttons" }],
		},
	],
};

const Gallery = function Preview(args: SectionNavProps) {
	const [hash, setHash] = React.useState(window.location.hash);

	React.useEffect(() => {
		const handleHashChange = () => setHash(window.location.hash);

		window.addEventListener("hashchange", handleHashChange);
		return () => window.removeEventListener("hashchange", handleHashChange);
	}, []);

	return (
		<div className="mx-auto grid max-w-6xl items-start gap-8 px-2 py-6 sm:px-6 lg:grid-cols-[12rem_minmax(0,1fr)]">
			<SectionNav {...args} currentHref={hash || args.currentHref} />
			<article className="min-w-0 space-y-6">
				<h1 id="overview" className="text-3xl font-semibold sm:text-4xl">
					Overview
				</h1>
				<section className="min-h-screen">
					<h2 id="typography" className="mb-2 text-xl font-semibold">
						Typography
					</h2>
					<p>Use headings to organize content.</p>
				</section>
				<section className="min-h-screen">
					<h2 id="spacing" className="mb-2 text-xl font-semibold">
						Spacing
					</h2>
					<p>Use section spacing between groups.</p>
				</section>
				<section>
					<h2 id="buttons" className="mb-2 text-xl font-semibold">
						Buttons
					</h2>
					<button className="button button-primary button-md" type="button">
						Save
					</button>
				</section>
			</article>
		</div>
	);
};

export const Preview = () => <Gallery {...exampleProps} />;
export const layout = "padded";

export const schema = z.pick(SectionNavPropsSchema, {
	label: true,
	currentHref: true,
});

export const Playground = (props: z.infer<typeof schema>) => (
	<SectionNav sections={exampleProps.sections} {...props} />
);

export const section = "Components";

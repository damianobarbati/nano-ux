import React from "react";
import { expect, userEvent, within } from "storybook/test";

import { SectionNav, type SectionNavProps } from "../components/SectionNav.tsx";

export default {
	title: "Components / SectionNav",
	component: SectionNav,
	parameters: { layout: "padded" },
};

export const GroupedNavigation = {
	name: "Grouped navigation",
	args: {
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
	},
	render: function Preview(args: SectionNavProps) {
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
					<section>
						<h2 id="typography" className="mb-2 text-xl font-semibold">
							Typography
						</h2>
						<p>Use headings to organize content.</p>
					</section>
					<section>
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
	},
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);

		const nav = within(canvas.getByRole("navigation", { name: "Sections" }));

		const menu = nav.queryByRole("button", { name: "Sections" });
		if (menu) await userEvent.click(menu);

		const controls = nav.getByRole("button", { name: "Controls" });

		await userEvent.click(controls);

		await expect(nav.getByRole("link", { name: "Buttons" })).toHaveAttribute(
			"href",
			"#buttons",
		);

		await userEvent.click(controls);
		await expect(controls).toHaveAttribute("aria-expanded", "false");
		await expect(nav.getByRole("link", { name: "Typography" })).toBeVisible();

		if (menu) await userEvent.click(menu);
	},
};

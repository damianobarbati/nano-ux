import cx from "clsx-tw";
import React from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../components/Button.tsx";

import {
	Spinner as SpinnerComponent,
	SpinnerProvider,
} from "../components/Spinner.tsx";

import { spinnerVariants } from "../components/spinnerVariants.tsx";

export default { title: "Foundation / Spinner", component: SpinnerComponent };

const SpinnerGallery = () => (
	<div className="grid min-w-0 auto-cols-[minmax(7rem,1fr)] grid-flow-col gap-2 overflow-x-auto text-fg">
		{Object.keys(spinnerVariants)
			.filter((variant) => variant !== "comet-corner-sync")
			.map((variant, index) => (
				<section
					key={variant}
					className="flex flex-col items-center gap-3 rounded-card border border-border bg-surface p-2 dark:border-[#555]"
				>
					<h2 className="text-sm">
						{index + 1}. {variant}
					</h2>
					<SpinnerProvider variants={spinnerVariants} defaultVariant={variant}>
						<SpinnerComponent centered={false} size="lg" />
						<Button loading size="sm">
							Loading
						</Button>
					</SpinnerProvider>
				</section>
			))}
	</div>
);

const ScrollCard = ({
	loading,
	overlay,
	internal,
}: {
	loading: boolean;
	overlay: boolean;
	internal: boolean;
}) => {
	const [count, setCount] = React.useState(0);
	const title = internal ? "Card scroll" : "Page scroll";
	const height = internal ? "h-[min(85dvh,900px)] overflow-auto" : "h-[1000px]";
	return (
		<section aria-label={title} className={cx("card grid min-w-0 p-0", height)}>
			{loading && (
				<SpinnerComponent
					overlay={overlay}
					className="col-start-1 row-start-1"
				/>
			)}
			<div
				className={cx(
					"col-start-1 row-start-1 flex flex-col p-4",
					internal ? "h-[1000px]" : "h-full",
				)}
			>
				<h2 className="mb-3 font-semibold">{title}</h2>
				<Button className="self-start" onClick={() => setCount(count + 1)}>
					Count {count}
				</Button>
				<ol className="mt-4 grid flex-1 auto-rows-fr divide-y divide-border">
					{Array.from({ length: 20 }, (_, index) => (
						<li key={index} className="flex items-center">
							Row {index + 1}
						</li>
					))}
				</ol>
			</div>
		</section>
	);
};

const ScrollablePanel = () => {
	const [loading, setLoading] = React.useState(false);
	const [overlay, setOverlay] = React.useState(true);
	return (
		<div className="grid gap-4">
			<div className="flex items-center gap-4">
				<Button aria-pressed={loading} onClick={() => setLoading(!loading)}>
					Toggle loading
				</Button>
				<label className="flex items-center gap-2">
					<input
						type="checkbox"
						className="control-checkbox"
						checked={overlay}
						onChange={(event) => setOverlay(event.currentTarget.checked)}
					/>
					Show overlay
				</label>
			</div>
			<div className="grid grid-cols-2 items-start gap-4">
				<ScrollCard internal loading={loading} overlay={overlay} />
				<ScrollCard internal={false} loading={loading} overlay={overlay} />
			</div>
		</div>
	);
};

export const Spinner = {
	parameters: { layout: "padded" },
	render: () => (
		<div className="mx-auto grid max-w-6xl gap-6">
			<SpinnerGallery />
			<ScrollablePanel />
		</div>
	),
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const toggle = canvas.getByRole("button", { name: "Toggle loading" });
		const panel = canvas.getByRole("region", { name: "Card scroll" });
		const pagePanel = canvas.getByRole("region", { name: "Page scroll" });
		const button = within(panel).getByRole("button", { name: "Count 0" });
		const viewport = canvasElement.ownerDocument.documentElement;

		panel.scrollTop = 60;
		await userEvent.click(toggle);
		panel.scrollIntoView({ block: "start", behavior: "instant" });
		viewport.scrollBy({ top: 110, behavior: "instant" });

		await waitFor(() => {
			for (const card of [panel, pagePanel]) {
				const icon = within(card).getByTitle("Loading").querySelector("svg");
				const bounds = icon?.getBoundingClientRect();
				if (!bounds) throw new Error("Missing spinner icon");

				const rect = card.getBoundingClientRect();
				const top = Math.max(0, rect.top + card.clientTop);

				const bottom = Math.min(
					viewport.clientHeight,
					rect.top + card.clientTop + card.clientHeight,
				);

				expect(bounds.top + bounds.height / 2).toBeCloseTo(
					(top + bottom) / 2,
					0,
				);

				expect(bounds.left + bounds.width / 2).toBeCloseTo(
					rect.left + card.clientLeft + card.clientWidth / 2,
					0,
				);
			}
		});

		button.click();
		await expect(button).toHaveTextContent("Count 0");
		await expect(panel.scrollTop).toEqual(60);
		await expect(getComputedStyle(panel).overflowY).toEqual("hidden");

		const wheel = new WheelEvent("wheel", { bubbles: true, cancelable: true });

		await expect(panel.dispatchEvent(wheel)).toEqual(false);

		await userEvent.click(toggle);
		await expect(getComputedStyle(panel).overflowY).toEqual("auto");
		await expect(panel.scrollTop).toEqual(60);
		button.click();
		await waitFor(() => expect(button).toHaveTextContent("Count 1"));
		panel.scrollTop = 0;
		viewport.scrollTo({ top: 0, behavior: "instant" });
	},
};

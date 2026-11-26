import cx from "clsx-tw";
import React from "react";
import * as z from "zod/mini";
import { Button } from "../../components/Button.tsx";

import {
	Spinner as SpinnerComponent,
	SpinnerPropsSchema,
	SpinnerProvider,
} from "../../components/Spinner.tsx";

import { spinnerVariants } from "../../components/spinnerVariants.tsx";

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

export const Preview = () => (
	<div className="mx-auto grid max-w-6xl gap-6">
		<SpinnerGallery />
		<ScrollablePanel />
	</div>
);

export const layout = "padded";

export const schema = z.pick(SpinnerPropsSchema, {
	size: true,
	centered: true,
	overlay: true,
	variant: true,
	label: true,
});

export const defaults = { centered: false };

export const Playground = (props: z.infer<typeof schema>) => (
	<SpinnerComponent {...props} />
);

export const section = "Foundation";

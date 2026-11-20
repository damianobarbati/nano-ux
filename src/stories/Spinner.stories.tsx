import { Button } from "../components/Button.tsx";
import { Spinner as SpinnerComponent } from "../components/Spinner.tsx";
import { spinnerVariants } from "../components/spinnerVariants.tsx";

export default { title: "Foundation / Spinner", component: SpinnerComponent };

export const Spinner = {
	render: () => (
		<div className="grid gap-6">
			<div className="grid w-full max-w-6xl grid-cols-5 gap-3 text-fg">
				{Object.keys(spinnerVariants).map((variant, index) => (
					<section
						key={variant}
						className="flex flex-col gap-3 rounded-card border border-border bg-surface p-3 dark:border-[#555]"
					>
						<h2 className="text-sm">
							{index + 1}. {variant}
						</h2>
						<div className="flex min-h-20 items-center justify-between gap-4 text-fg">
							{(["sm", "md", "lg", "xl"] as const).map((size) => (
								<SpinnerComponent key={size} size={size} variant={variant} />
							))}
						</div>
						<Button disabled>
							<SpinnerComponent size="sm" variant={variant} />
							Loading
						</Button>
					</section>
				))}
			</div>
		</div>
	),
};

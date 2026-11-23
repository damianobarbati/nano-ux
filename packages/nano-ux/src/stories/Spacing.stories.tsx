import { cx } from "../components/Button.tsx";

const spacingScale = [
	{ step: "0", value: "0rem", className: "w-0" },
	{ step: "0.5", value: "0.125rem", className: "w-0.5" },
	{ step: "1", value: "0.25rem", className: "w-1" },
	{ step: "2", value: "0.5rem", className: "w-2" },
	{ step: "3", value: "0.75rem", className: "w-3" },
	{ step: "4", value: "1rem", className: "w-4" },
	{ step: "5", value: "1.25rem", className: "w-5" },
	{ step: "6", value: "1.5rem", className: "w-6" },
	{ step: "8", value: "2rem", className: "w-8" },
	{ step: "10", value: "2.5rem", className: "w-10" },
	{ step: "12", value: "3rem", className: "w-12" },
	{ step: "16", value: "4rem", className: "w-16" },
	{ step: "24", value: "6rem", className: "w-24" },
	{ step: "32", value: "8rem", className: "w-32" },
];

const radiusScale = [
	{
		token: "--radius-control",
		value: "0.375rem",
		className: "rounded-control",
	},
	{ token: "--radius-card", value: "0.625rem", className: "rounded-card" },
];

export default {
	title: "Foundation / Spacing and rounding",
	parameters: { layout: "fullscreen" },
};

export const SpacingAndRounding = {
	name: "Spacing and rounding",
	render: () => (
		<main className="grid min-h-screen content-start gap-12 bg-bg p-6 text-fg lg:p-8">
			<section className="grid gap-6">
				<header>
					<h1>Spacing</h1>
					<p>
						Base: --spacing = 0.25rem. Each step multiplies the base for
						padding, margin and gap.
					</p>
				</header>
				<div className="grid items-start gap-8 lg:grid-cols-2">
					<div className="overflow-x-auto">
						<table className="w-full text-left text-sm">
							<thead>
								<tr className="border-b border-border">
									<th className="p-3 font-medium">Step</th>
									<th className="p-3 font-medium">Size</th>
									<th className="p-3 font-medium">Preview</th>
								</tr>
							</thead>
							<tbody>
								{spacingScale.map(({ step, value, className }) => (
									<tr className="border-b border-border" key={step}>
										<td className="p-3 font-mono">{step}</td>
										<td className="p-3 font-mono">{value}</td>
										<td className="p-3">
											<div
												className={cx(className, "h-3 bg-fg")}
												aria-hidden="true"
											/>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<div className="grid gap-8">
						<div className="grid gap-3">
							<h2 className="text-xl">Padding</h2>
							<code className="text-sm">p-4 = 1rem on each side</code>
							<div className="rounded-card bg-fg/20 p-4">
								<div className="rounded-control border border-border bg-surface p-4 text-sm">
									Content
								</div>
							</div>
						</div>
						<div className="grid gap-3">
							<h2 className="text-xl">Gap</h2>
							<code className="text-sm">gap-4 = 1rem between items</code>
							<div className="grid grid-cols-3 gap-4 rounded-card bg-fg/20">
								{[1, 2, 3].map((item) => (
									<div
										className="grid h-20 place-items-center rounded-control border border-border bg-surface text-sm"
										key={item}
									>
										{item}
									</div>
								))}
							</div>
						</div>
						<p className="text-sm text-fg-muted">
							Typography gutters use separate rules. In Typography, each gutter
							is 0.5 × the element font size.
						</p>
					</div>
				</div>
			</section>
			<section className="grid gap-6">
				<h2>Rounding</h2>
				<div className="grid gap-6 sm:grid-cols-2">
					{radiusScale.map(({ token, value, className }) => (
						<div className="grid gap-3" key={token}>
							<div
								className={cx(
									className,
									"grid h-32 place-items-center border-2 border-fg bg-layer",
								)}
							>
								<code className="text-sm">{className}</code>
							</div>
							<div className="flex flex-wrap justify-between gap-2 font-mono text-sm text-fg-muted">
								<span>{token}</span>
								<span>{value}</span>
							</div>
						</div>
					))}
				</div>
			</section>
		</main>
	),
};

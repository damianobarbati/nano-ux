import cx from "clsx-tw";

import {
	Button,
	Checkbox,
	Code,
	createColumnHelper,
	Dialog,
	FadeIn,
	Form,
	ICheck,
	IClose,
	Input,
	InputSearch,
	InputTime,
	KPI,
	type KPIProps,
	Mockup,
	SelectMulti,
	Slider,
	Spinner,
	TableVirtual,
	Textarea,
	Toast,
	Toggle,
	Tooltip,
	type tableVirtualFeatures,
	useInViewOnce,
} from "nano-ux";

import React from "react";
import { createPortal } from "react-dom";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import {
	dailySignups,
	emptyProfile,
	interestOptions,
	type Profile,
	profileSeries,
	profiles,
	sampleProfile,
	signupActivityByCountry,
	signupSeries,
} from "../data.ts";

const lightLogo = `${import.meta.env.BASE_URL}logo-light.svg`;

const ChartBar = React.lazy(async () => {
	const { ChartBar } = await import("nano-ux/charts/bar");
	return { default: ChartBar };
});

const ChartLine = React.lazy(async () => {
	const { ChartLine } = await import("nano-ux/charts/line");
	return { default: ChartLine };
});

const WorldMap = React.lazy(async () => {
	const { WorldMap } = await import("nano-ux/charts/world-map");
	return { default: WorldMap };
});

type BrandProps = {
	brand: string;
	onBrandChange: (brand: string) => void;
};

const brandValue = (brand: string) =>
	brand === "Default" ? "" : `var(--theme-${brand.toLowerCase()})`;

export const route = { metadata: { title: "nano-ux" } };

export const Page = () => {
	const [brand, setBrand] = React.useState("Default");

	const changeBrand = (name: string) => {
		document.documentElement.style.setProperty(
			"--color-brand",
			brandValue(name),
		);

		setBrand(name);
	};

	return (
		<>
			<section
				data-theme-background
				className="grid items-center gap-8 py-12 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16 lg:py-24"
			>
				<div data-theme-background className="min-w-0 text-center">
					<h1
						data-theme-background
						className="heading-hero flex flex-col items-center text-balance"
					>
						<strong className="mb-1 flex items-center gap-[0.2em] whitespace-nowrap max-[390px]:text-[14vw] md:max-lg:text-[7vw]">
							<img src={lightLogo} className="size-[0.8em] shrink-0" />
							nano-ux
							<img src={lightLogo} className="size-[0.8em] shrink-0" />
						</strong>
						<span>Write less.</span>
						<span>Ship more.</span>
					</h1>
					<p data-theme-background className="mx-auto mt-3 max-w-prose">
						<span>
							<strong>nano-ux</strong> is an opinionated UI kit built with{" "}
							<strong>React</strong> and <strong>Tailwind CSS</strong>.<br />{" "}
							Set your theme once with CSS variables, <br />
							then use it across HTML elements and React components.
						</span>
					</p>
					<div
						data-theme-background
						className="mt-6 flex flex-wrap justify-center gap-3"
					>
						<Button as="a" href="./documentation#setup">
							Get started
						</Button>
						<Button as="a" href="#theme" variant="outline" color="secondary">
							Try the theme
						</Button>
					</div>
				</div>
				<div
					data-theme-background
					className="mx-auto grid w-full max-w-lg min-w-0 grid-cols-1 gap-4 text-left"
				>
					<Mockup variant="terminal" appearance="dark">
						npm install nano-ux
					</Mockup>
					<figure>
						<figcaption className="mb-1 font-mono text-xs text-fg-muted">
							src/index.css
						</figcaption>
						<Code
							className="dark text-start"
							language="css"
							text={`@import "nano-ux/theme.css";

:root {
  --color-brand: var(--theme-lime);
  --font-family: Georgia, serif;
}`}
						/>
					</figure>
					<figure>
						<figcaption className="mb-1 font-mono text-xs text-fg-muted">
							src/index.tsx
						</figcaption>
						<Code
							className="dark text-start"
							language="tsx"
							text={`import { createRoot } from "react-dom/client";
import { Button } from "nano-ux";

const App = () => <Button>Save</Button>;

createRoot(document.getElementById("root")).render(<App />);`}
						/>
					</figure>
				</div>
			</section>
			<Theme brand={brand} onBrandChange={changeBrand} />
			<Colors brand={brand} onBrandChange={changeBrand} />
			<Typography />
			<ProfileForm />
			<Feedback />
			<Dashboard />
		</>
	);
};

const themeFonts = {
	Default: "",
	Montserrat: '"Montserrat Variable", system-ui, sans-serif',
	Nunito: '"Nunito Variable", system-ui, sans-serif',
	Chivo: '"Chivo Variable", system-ui, sans-serif',
	Inter: '"Inter Variable", system-ui, sans-serif',
	Geist: '"Geist Variable", system-ui, sans-serif',
	"Science Gothic": '"Science Gothic Variable", system-ui, sans-serif',
	Monospace: "ui-monospace, monospace",
};

const fontOptions = Object.entries(themeFonts).map(([label, value]) => ({
	label,
	value: value || "Default",
}));

const themeSliders = [
	{
		property: "--tracking",
		defaultValue: 0,
		unit: "em",
		min: -0.02,
		max: 0.05,
		step: 0.005,
	},
	{
		property: "--spacing",
		defaultValue: 0.25,
		unit: "rem",
		min: 0.1875,
		max: 0.3125,
		step: 0.015625,
	},
	{
		property: "--radius-control",
		defaultValue: 0.375,
		unit: "rem",
		min: 0,
		max: 1,
		step: 0.0625,
	},
	{
		property: "--radius-card",
		defaultValue: 0.625,
		unit: "rem",
		min: 0,
		max: 2,
		step: 0.0625,
	},
] as const;

const sliderDefaults = Object.fromEntries(
	themeSliders.map(({ property, defaultValue }) => [property, defaultValue]),
);

const defaultTheme: Record<string, string> = {
	"--font-family": themeFonts.Default,
};

for (const { property, defaultValue, unit } of themeSliders) {
	defaultTheme[property] = defaultValue + unit;
}

const Theme = ({ brand, onBrandChange }: BrandProps) => {
	const [theme, setTheme] = React.useState<Record<string, string>>({
		...defaultTheme,
		"--font-family": themeFonts.Montserrat,
	});

	const selectForm = useForm({
		values: { brand, font: theme["--font-family"] || "Default" },
	});

	const sliderForm = useForm({ defaultValues: sliderDefaults });

	const changeValue = (
		property: "--font-family" | (typeof themeSliders)[number]["property"],
		value: string,
	) => {
		document.documentElement.style.setProperty(property, value || "initial");
		setTheme((previous) => ({ ...previous, [property]: value }));
	};

	const reset = () => {
		for (const property of Object.keys(defaultTheme)) {
			document.documentElement.style.removeProperty(property);
		}

		document.documentElement.style.setProperty("--font-family", "initial");

		sliderForm.reset(sliderDefaults);
		setTheme(defaultTheme);
		onBrandChange("Default");
	};

	const declarations = Object.entries({
		"--color-brand": brandValue(brand) || "initial",
		...theme,
	})
		.filter(([, value]) => value)
		.map(([property, value]) => `  ${property}: ${value};`);

	const css = [":root {", ...declarations, "}"].join("\n");

	return (
		<FadeIn aria-labelledby="theme" className="py-12">
			<h2 id="theme" className="typo-lg scroll-mt-6">
				Customize the theme
			</h2>
			<p className="prose">
				Adjust the controls to preview changes across the site. Copy the CSS
				into your stylesheet after importing <code>nano-ux/theme.css</code>.
			</p>
			<div className="mt-6 grid items-start gap-6 md:grid-cols-2">
				<div className="card @container grid min-w-0 gap-4 md:col-start-2 md:row-start-1">
					<FormProvider {...selectForm}>
						<SelectMulti
							name="brand"
							label="--color-brand"
							mode="one"
							searchable={false}
							options={brandOptions}
							onChange={onBrandChange}
						/>
						<SelectMulti
							name="font"
							label="--font-family"
							mode="one"
							searchable={false}
							options={fontOptions}
							onChange={(value) =>
								changeValue("--font-family", value === "Default" ? "" : value)
							}
						/>
					</FormProvider>
					<FormProvider {...sliderForm}>
						<div className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-2 @md:grid-cols-[max-content_minmax(0,1fr)_11ch]">
							{themeSliders.map(({ property, unit, min, max, step }) => (
								<div
									key={property}
									className="col-span-full grid grid-cols-subgrid items-center"
								>
									<label className="control-label" htmlFor={property}>
										{property}
									</label>

									<Slider
										className="col-span-full @md:col-span-1 @md:col-start-2 @md:row-start-1"
										id={property}
										name={property}
										min={min}
										max={max}
										step={step}
										onChange={(event) =>
											changeValue(property, event.target.value + unit)
										}
									/>
									<span className="col-start-2 row-start-1 justify-self-end font-mono text-fg-muted @md:col-start-3">
										{theme[property]}
									</span>
								</div>
							))}
						</div>
					</FormProvider>
					<Button
						className="justify-self-start"
						variant="outline"
						onClick={reset}
					>
						Reset theme
					</Button>
				</div>
				<Code className="dark" language="css" text={css} />
			</div>
		</FadeIn>
	);
};

const Typography = () => {
	return (
		<FadeIn aria-labelledby="typography" className="py-12">
			<h2 id="typography" className="typo-lg scroll-mt-6">
				Typography
			</h2>
			<p className="prose">
				The nano-ux theme styles HTML elements <strong>automatically</strong>.
			</p>
			<ul className="prose">
				<li>
					Use <code>h1</code> for the page title.
				</li>
				<li>
					Use <code>h2</code> for sections.
				</li>
				<li>
					Use <code>h3</code> for subsections.
				</li>
				<li>
					Use <code>p</code> for body text.
				</li>
			</ul>
			<p className="prose">
				Apply <code>typo-lg</code> to a container for larger body text.
			</p>
			<div className="mt-6 grid gap-8 min-[1080px]:grid-cols-[minmax(0,5fr)_minmax(0,9fr)]">
				{[false, true].map((large) => (
					<article
						key={String(large)}
						className={large ? "card typo-lg" : "card"}
					>
						<p className="text-sm font-medium text-fg-muted">
							{large ? "Large scale with .typo-lg" : "Standard scale"}
						</p>
						<h1>Page title · {large ? "48–64" : "28"} px</h1>
						<h2>Section · {large ? "32–48" : "22"} px</h2>
						<h3>Subsection · {large ? "24–32" : "18"} px</h3>
						<p>Body text · {large ? "17" : "16"} px</p>
						<small>Small print · 87.5% of the parent’s font size</small>
					</article>
				))}
				<article className="card min-w-0">
					<h3>Customize body text</h3>
					<p>
						Set the font size and line height for body text. Use{" "}
						<code>--content-spacing</code> to set the gap after a text block
						when another element follows it.
					</p>
					<Code
						className="dark"
						language="css"
						text={`:root {
  --body-size: 1.125rem;
  --body-line-height: 1.6;
  --content-spacing: 0.75em;
}`}
					/>
				</article>
				<article className="card min-w-0">
					<h3>Typography utilities</h3>
					<p>
						Add <code>heading-hero</code> to an <code>h1</code> to scale its
						size with the viewport between 3rem and 5rem.
					</p>
					<p>
						Add <code>text-box-trim</code> to trim space above the first line
						and below the last line in supporting browsers. You can use both
						classes on the same heading.
					</p>
					<p>
						Apply <code>prose</code> to a paragraph or its container to limit
						its width to <code>60ch</code>. This keeps long lines easier to read
						on wide screens.
					</p>
					<Code
						className="dark"
						language="html"
						text={`<h1 class="heading-hero text-box-trim">Welcome</h1>
<p class="prose">A short introduction to the project.</p>`}
					/>
				</article>
			</div>
		</FadeIn>
	);
};

const ProfilePreview = () => {
	const values = useWatch<typeof sampleProfile>();

	const text = JSON.stringify(
		{ ...values, password: values.password ? "••••••••" : "" },
		null,
		2,
	);

	return (
		<figure className="min-w-0">
			<figcaption className="mb-2 text-sm font-semibold">
				Form data (JSON)
			</figcaption>
			<Code language="json" text={text} copyable={false} />
		</figure>
	);
};

const ProfileForm = () => {
	const form = useForm<typeof sampleProfile>({ defaultValues: emptyProfile });
	const loading = form.formState.isSubmitting;
	const [result, setResult] = React.useState<"success" | "failure">();
	const { submitCount } = form.formState;

	React.useEffect(() => {
		if (!result) return;

		const timer = window.setTimeout(() => setResult(undefined), 2000);
		return () => window.clearTimeout(timer);
	}, [result, submitCount]);

	const submit = async () => {
		setResult(undefined);
		await new Promise((resolve) => setTimeout(resolve, 1000));
		form.reset(emptyProfile);
		setResult("success");
	};

	return (
		<FadeIn className="w-full min-w-0 py-12">
			<h2 id="new-profile" className="typo-lg scroll-mt-6">
				Form
			</h2>
			<Form
				className="grid items-start gap-8 md:grid-cols-2 md:gap-12 lg:gap-16"
				form={form}
				onSubmit={submit}
				onSubmitError={() => setResult("failure")}
			>
				<div className="min-w-0">
					<fieldset
						disabled={loading}
						className="grid grid-cols-2 gap-4 *:min-w-0 [@media(max-width:32rem)]:grid-cols-1"
					>
						<Input
							label="Full name"
							name="full_name"
							autoComplete="name"
							required
							rules={{
								required: "Enter a name.",
								pattern: { value: /\S/, message: "Enter a name." },
							}}
						/>
						<SelectMulti
							label="Gender"
							name="gender"
							mode="one"
							searchable={false}
							placeholder="Select an option"
							options={[
								{ label: "Select an option", value: "" },
								{ label: "Male", value: "Male" },
								{ label: "Female", value: "Female" },
							]}
						/>
						<Input
							label="Email"
							name="email"
							autoComplete="email"
							inputMode="email"
							rules={{ required: "Enter an email address." }}
							required
						/>
						<Input
							label="Password"
							type="password"
							name="password"
							autoComplete="new-password"
						/>
						<InputTime label="Birth date" name="birth_date" type="date" />
						<SelectMulti
							name="interests"
							label="Interests"
							options={interestOptions}
						/>
						<Textarea
							className="col-span-full"
							label="Bio"
							name="bio"
							rows={3}
						/>
						<Slider
							className="col-span-full"
							label="Notification volume"
							name="volume"
						/>
						<Checkbox label="Accept terms" name="accept_terms" />
						<Toggle
							className="justify-self-end"
							label="Notifications"
							name="notifications"
						/>
					</fieldset>
					<footer className="mt-6 flex flex-wrap items-center justify-end gap-3">
						<Button
							className="me-auto"
							color="danger"
							variant="outline"
							onClick={() => form.reset(emptyProfile)}
							disabled={loading}
						>
							Reset
						</Button>
						<Button
							color="secondary"
							variant="outline"
							onClick={() => form.reset(sampleProfile)}
							disabled={loading}
						>
							Autofill
						</Button>
						<Button
							className={cx(
								result === "success" && "[&_.button-icon>svg]:text-success",
								result === "failure" && "[&_.button-icon>svg]:text-danger",
							)}
							type="submit"
							loading={loading}
							rightIcon={{
								icon: result === "failure" ? IClose : ICheck,
								visible: !!result,
							}}
						>
							Submit
						</Button>
					</footer>
				</div>
				<ProfilePreview />
			</Form>
		</FadeIn>
	);
};

const feedbackOptions = [
	{
		label: "Success",
		color: "success",
		tone: "success",
		message: "Profile saved.",
	},
	{
		label: "Warning",
		color: "warning",
		tone: "warning",
		message: "You have unsaved changes.",
	},
	{
		label: "Error",
		color: "danger",
		tone: "error",
		message: "Could not save the profile. Try again.",
	},
] as const;

const feedbackSpinners = [
	"arc",
	"comet",
	"orbit",
	"ring-in",
	"ring-out",
	"edge-travel",
	"face-scan",
	"infinity",
];

const Feedback = () => {
	const [confirmOpen, setConfirmOpen] = React.useState(false);
	const closeConfirmation = () => setConfirmOpen(false);

	const [notice, setNotice] = React.useState<{
		timestamp: number;
		option: (typeof feedbackOptions)[number];
		trigger: HTMLButtonElement;
	}>();

	return (
		<FadeIn id="feedback" className="scroll-mt-6 py-12">
			<h2 className="typo-lg">Feedback</h2>
			<div className="grid items-center gap-x-8 gap-y-2 md:grid-cols-[1fr_2fr]">
				<div className="flex flex-wrap gap-3">
					{feedbackOptions.map((option) => (
						<Button
							key={option.tone}
							color={option.color}
							onClick={(event) =>
								setNotice({
									timestamp: event.timeStamp,
									option,
									trigger: event.currentTarget,
								})
							}
						>
							{option.label}
						</Button>
					))}
					<Tooltip content="Open the confirmation dialog">
						<Button aria-haspopup="dialog" onClick={() => setConfirmOpen(true)}>
							Confirm
						</Button>
					</Tooltip>
				</div>
				<p className="text-sm text-fg-muted md:col-start-1 md:row-start-2">
					Press each button to see the toast or dialog
				</p>
				<ul
					aria-label="Spinners"
					className="flex min-w-0 flex-wrap items-center justify-between gap-3 py-1 max-md:mt-6 md:col-start-2 md:row-start-1"
				>
					{feedbackSpinners.map((name) => (
						<li
							key={name}
							className="flex shrink-0 flex-col items-center gap-2 text-center"
						>
							<Spinner centered={false} variant={name} size="lg" />
							<code className="text-xs">{name}</code>
						</li>
					))}
				</ul>
			</div>
			<Dialog
				open={confirmOpen}
				title="Confirm action"
				confirmLabel="Proceed"
				onClose={closeConfirmation}
				onConfirm={closeConfirmation}
			>
				Do you want to proceed?
			</Dialog>
			{notice &&
				createPortal(
					<Toast
						key={notice.timestamp}
						duration={5000}
						tone={notice.option.tone}
						message={notice.option.message}
						onClose={(reason) => {
							if (reason === "dismiss") notice.trigger.focus();
							setNotice(undefined);
						}}
					/>,
					document.body,
				)}
		</FadeIn>
	);
};

const brandColors = [
	"Default",
	"Cocoa",
	"Mint",
	"Lime",
	"Cyan",
	"Ocean",
	"Violet",
	"Berry",
];

const brandOptions = brandColors.map((name) => {
	const backgroundColor = brandValue(name) || "var(--color-fg)";

	const result = {
		label: name,
		value: name,
		content: (
			<>
				<span
					aria-hidden="true"
					className="grid size-4 shrink-0 grid-cols-2 overflow-hidden rounded-sm"
				>
					<span className="scheme-light" style={{ backgroundColor }} />
					<span className="scheme-dark" style={{ backgroundColor }} />
				</span>
				{name}
			</>
		),
	};

	return result;
});

const Colors = ({ brand, onBrandChange }: BrandProps) => {
	return (
		<FadeIn id="colors" className="scroll-mt-6 py-12">
			<h2 className="typo-lg">Colors</h2>
			<p>
				Choose the primary color. To switch between light and dark themes, press{" "}
				<kbd>Shift</kbd> + <kbd>T</kbd> or{" "}
				<span className="pointer-coarse:hidden">double click</span>
				<span className="hidden pointer-coarse:inline">double tap</span> the
				page background.
			</p>
			<div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-8">
				{brandColors.map((name) => {
					const swatchColor = brandValue(name) || "var(--color-fg)";

					return (
						<Button
							key={name}
							style={{ "--theme-primary": swatchColor } as React.CSSProperties}
							variant="outline"
							aria-pressed={brand === name}
							rightIcon={{ icon: ICheck, visible: brand === name }}
							onClick={() => onBrandChange(name)}
						>
							<span
								aria-hidden="true"
								className="size-4 rounded-full bg-current"
							/>
							{name}
						</Button>
					);
				})}
			</div>
		</FadeIn>
	);
};

const column = createColumnHelper<typeof tableVirtualFeatures, Profile>();

const columns = column.columns([
	column.accessor("name", { header: "Name", size: 180 }),
	column.accessor("email", { header: "Email", size: 260 }),
	column.accessor((row) => row.interests.join(", ") || "—", {
		id: "interests",
		header: "Interests",
		size: 160,
	}),
]);

const useProfileSearch = () => {
	const search = useForm({ defaultValues: { query: "" } });
	const query = useWatch({ control: search.control, name: "query" });

	const filteredProfiles = React.useMemo(() => {
		const term = query.trim().toLowerCase();
		if (!term) return profiles;

		const result = profiles.filter((row) =>
			[row.name, row.email, ...row.interests].some((value) =>
				value.toLowerCase().includes(term),
			),
		);

		return result;
	}, [query]);

	return { search, query, filteredProfiles };
};

type ProfileTableProps = ReturnType<typeof useProfileSearch>;

const ProfileTable = ({
	search,
	query,
	filteredProfiles,
}: ProfileTableProps) => {
	const inputId = React.useId();

	return (
		<>
			<h3>TableVirtual</h3>
			<FormProvider {...search}>
				<InputSearch
					id={inputId}
					name="query"
					aria-label="Search profiles"
					placeholder="Search"
				/>
			</FormProvider>
			<TableVirtual
				key={query}
				className="mbs-4 h-96"
				columns={columns}
				data={filteredProfiles}
				getRowId={(row) => row.id}
				emptyMessage="No profiles found."
				footer={
					<p role="status">
						{query.trim() &&
							`${filteredProfiles.length.toLocaleString("en-US")} matching · `}
						{profiles.length.toLocaleString("en-US")} rows
					</p>
				}
			/>
		</>
	);
};

const dashboardKpis: KPIProps[] = [
	{ label: "Profiles", value: profiles.length, formatAs: "number", delta: 8.2 },
	{
		label: "Weekly signups",
		delta: 4.8,
		value: dailySignups.reduce((total, { values }) => total + values[0], 0),
	},
	{
		label: "Conversion rate",
		value: 12.5,
		formatAs: "percent",
		delta: -2.1,
	},
	{ label: "Session length", value: 85, formatAs: "duration", delta: -3.8 },
	{ label: "Revenue", value: 1250, formatAs: "USD" },
];

const dashboardCardClasses = {
	solid: "card",
	ghost: "card-ghost",
	outline: "card-outline",
} as const;

const Dashboard = () => {
	const { ref, hasEnteredView } = useInViewOnce();

	return (
		<FadeIn
			id="dashboard"
			className="relative grid min-w-0 scroll-mt-6 gap-y-8 py-12 [overflow-anchor:none] md:gap-y-12"
		>
			{hasEnteredView ? (
				<DashboardContent />
			) : (
				<>
					<div
						ref={ref}
						className="pointer-events-none absolute inset-0 hidden md:block"
					/>
					<h2 className="text-box-trim mbe-0">Dashboard</h2>
					<p className="md:hidden">
						Open this page on a computer to view the dashboard.
					</p>
				</>
			)}
		</FadeIn>
	);
};

const DashboardContent = () => {
	const appearance = useForm<{ variant: keyof typeof dashboardCardClasses }>({
		defaultValues: { variant: "solid" },
	});

	const variant = useWatch({ control: appearance.control, name: "variant" });
	const cardClassName = dashboardCardClasses[variant];
	const profileTable = useProfileSearch();
	const { filteredProfiles } = profileTable;
	const chartClassName = cx("flex min-w-0 flex-col", cardClassName);

	const profilesByInterest = React.useMemo(
		() =>
			interestOptions.map(({ label, value }) => ({
				label,
				values: [
					filteredProfiles.filter((profile) =>
						profile.interests.includes(value),
					).length,
				],
			})),
		[filteredProfiles],
	);

	return (
		<>
			<header className="grid gap-3">
				<div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
					<h2 className="text-box-trim mbe-0">Dashboard</h2>
					<FormProvider {...appearance}>
						<SelectMulti
							className="ms-auto w-40 max-md:hidden"
							placeholder="Dashboard card style"
							name="variant"
							mode="one"
							searchable={false}
							options={[
								{ value: "solid", label: "Card" },
								{ value: "outline", label: "Card outline" },
								{ value: "ghost", label: "Card ghost" },
							]}
						/>
					</FormProvider>
				</div>
				<p className="md:hidden">
					Open this page on a computer to view the dashboard.
				</p>
				<div className="hidden gap-4 md:grid md:grid-cols-3 lg:grid-cols-5">
					{dashboardKpis.map((indicator) => (
						<KPI
							key={indicator.label}
							{...indicator}
							variant={variant}
							className="min-w-0"
						/>
					))}
				</div>
			</header>
			<div className="hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
				<section className={chartClassName}>
					<h3>ChartBar</h3>
					<React.Suspense
						fallback={
							<div className="grid h-56 place-items-center">
								<Spinner label="Loading ChartBar" />
							</div>
						}
					>
						<ChartBar
							className="mt-auto h-56"
							label="Profiles by interest"
							data={profilesByInterest}
							series={profileSeries}
							valueFormatter={String}
						/>
					</React.Suspense>
				</section>
				<section className={chartClassName}>
					<h3>ChartLine</h3>
					<React.Suspense
						fallback={
							<div className="grid h-56 place-items-center">
								<Spinner label="Loading ChartLine" />
							</div>
						}
					>
						<ChartLine
							className="mt-auto"
							label="Daily signups, 21–27 September"
							series={signupSeries}
							data={dailySignups}
							interval="day"
							valueFormatter={String}
						/>
					</React.Suspense>
				</section>
				<section className={cx(chartClassName, "md:col-span-2 lg:col-span-1")}>
					<h3>WorldMap</h3>
					<div className="my-auto aspect-[802/405] w-full">
						<React.Suspense
							fallback={
								<div className="grid h-full place-items-center">
									<Spinner label="Loading WorldMap" />
								</div>
							}
						>
							<WorldMap
								label="Signup activity relative to the leading country"
								data={signupActivityByCountry}
								color="var(--color-brand, var(--theme-fg))"
							/>
						</React.Suspense>
					</div>
				</section>
			</div>
			<section
				id="profiles"
				className={cx("min-w-0 scroll-mt-6 max-md:hidden", cardClassName)}
			>
				<ProfileTable {...profileTable} />
			</section>
		</>
	);
};

import cx from "clsx-tw";
import { Code, Mockup, SectionNav } from "nano-ux";
import React from "react";
import { CssClassCatalog, cssReferenceLinks } from "./CssClassCatalog.tsx";
import { colorOptions, ReferenceFormPreview } from "./ReferenceFormPreview.tsx";
import { ReferenceLazyPreview } from "./ReferenceLazyPreview.tsx";
import { ReferenceTablePreview } from "./ReferenceTablePreview.tsx";
import { ReferenceToastPreview } from "./ReferenceToastPreview.tsx";
import { AccordionLink } from "./reference/AccordionLink.tsx";
import accordionLinkSource from "./reference/AccordionLink.tsx?raw";
import { ArchivePrompt } from "./reference/ArchivePrompt.tsx";
import archivePromptSource from "./reference/ArchivePrompt.tsx?raw";
import { BillingDetails } from "./reference/BillingDetails.tsx";
import billingDetailsSource from "./reference/BillingDetails.tsx?raw";
import dailySignupsSource from "./reference/DailySignups.tsx?raw";
import headerSource from "./reference/Header.tsx?raw";
import { ProfileForm } from "./reference/ProfileForm.tsx";
import profileFormSource from "./reference/ProfileForm.tsx?raw";
import { ProfileTable } from "./reference/ProfileTable.tsx";
import profileTableSource from "./reference/ProfileTable.tsx?raw";
import { SaveButton } from "./reference/SaveButton.tsx";
import saveButtonSource from "./reference/SaveButton.tsx?raw";
import signupsByCountrySource from "./reference/SignupsByCountry.tsx?raw";
import signupsByPlanSource from "./reference/SignupsByPlan.tsx?raw";
import signupsBySourceSource from "./reference/SignupsBySource.tsx?raw";

type ReferenceProps = { className?: string };

type ReferenceExample = {
	id: string;
	kind: string;
	title: string;
	description: React.ReactNode;
	language: string;
	text: string;
	preview?: React.ReactNode;
};

const SignupsBySource = React.lazy(async () => {
	const { SignupsBySource } = await import("./reference/SignupsBySource.tsx");
	const result = { default: SignupsBySource };
	return result;
});

const DailySignups = React.lazy(async () => {
	const { DailySignups } = await import("./reference/DailySignups.tsx");
	const result = { default: DailySignups };
	return result;
});

const SignupsByPlan = React.lazy(async () => {
	const { SignupsByPlan } = await import("./reference/SignupsByPlan.tsx");
	const result = { default: SignupsByPlan };
	return result;
});

const SignupsByCountry = React.lazy(async () => {
	const { SignupsByCountry } = await import("./reference/SignupsByCountry.tsx");
	const result = { default: SignupsByCountry };
	return result;
});

const terminalOutput = "$ pnpm build\nBuild complete.";

const codeSample = "const count: number = 12;";

const examples: ReferenceExample[] = [
	{
		id: "reference-theme",
		kind: "Component",
		title: "ThemeSelector",
		description:
			"The selector cycles through System, Light, and Dark. It restores the saved preference and uses defaultTheme when no preference is available.",
		language: "tsx",
		text: headerSource,
		preview: (
			<iframe
				className="h-28 w-full rounded-card border border-border bg-bg"
				loading="lazy"
				src={`${import.meta.env.BASE_URL}theme-preview`}
				title="ThemeSelector preview"
			/>
		),
	},
	{
		id: "reference-dialog",
		kind: "Component",
		title: "Dialog",
		description:
			"Set open to control visibility. Escape requests close. Enable closeOnBackdrop to close on outside clicks. Set busy during confirmation to prevent dismissal and repeat submission.",
		language: "tsx",
		text: archivePromptSource,
		preview: <ArchivePrompt />,
	},
	{
		id: "reference-toast",
		kind: "Component",
		title: "Toast",
		description:
			"Set the duration in milliseconds and use the close reason to restore focus after manual dismissal.",
		language: "tsx",
		text: `import { Button, Toast } from "nano-ux";
import { useState } from "react";

export const Notice = () => {
  const [trigger, setTrigger] = useState<HTMLButtonElement>();

  return <>
    <Button as="button" type="button" onClick={e => setTrigger(e.currentTarget)}>
      Show toast
    </Button>
    {trigger && <Toast message="Saved" duration={5000}
      onClose={reason => {
        if (reason === "dismiss") trigger.focus();
        setTrigger(undefined);
      }} />}
  </>;
};`,
		preview: <ReferenceToastPreview />,
	},
	{
		id: "reference-mockup",
		kind: "Component",
		title: "Mockup",
		description:
			"Terminal inherits the current theme. Set appearance to light or dark to override it. Browser is the default variant and accepts an optional address.",
		language: "tsx",
		text: `import { Mockup } from "nano-ux";

export const Previews = () => (
  <>
    <Mockup variant="terminal">
      {${JSON.stringify(terminalOutput)}}
    </Mockup>
    <Mockup address="https://example.com">
      <p>Project overview</p>
    </Mockup>
    <Mockup variant="smartphone">
      <p>Mobile inbox</p>
    </Mockup>
  </>
);`,
		preview: (
			<div className="grid min-w-0 items-start gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,10rem)]">
				<div className="grid min-w-0 gap-4">
					<figure className="m-0 min-w-0">
						<figcaption className="mb-2">
							<code>terminal</code>
						</figcaption>
						<Mockup variant="terminal">{terminalOutput}</Mockup>
					</figure>
					<figure className="m-0 min-w-0">
						<figcaption className="mb-2">
							<code>browser</code>
						</figcaption>
						<Mockup address="https://example.com">
							<p className="p-4">Project overview</p>
						</Mockup>
					</figure>
				</div>
				<figure className="m-0 min-w-0">
					<figcaption className="mb-2">
						<code>smartphone</code>
					</figcaption>
					<Mockup className="max-w-40" variant="smartphone">
						<p className="p-4">Mobile inbox</p>
					</Mockup>
				</figure>
			</div>
		),
	},
	{
		id: "reference-code",
		kind: "Component",
		title: "Code",
		description:
			"Pass source text and its language for syntax highlighting. The copy button appears by default. Set copyable to false to hide it.",
		language: "tsx",
		text: `import { Code } from "nano-ux";

export const Source = () => (
  <Code language="typescript" text={${JSON.stringify(codeSample)}} />
);`,
		preview: <Code language="typescript" text={codeSample} />,
	},
	{
		id: "reference-form",
		kind: "Component",
		title: "Form",
		description:
			"Pass the result of useForm to Form. Use field rules for validation and isSubmitting to show feedback while the save runs.",
		language: "tsx",
		text: profileFormSource,
		preview: <ProfileForm />,
	},
	{
		id: "reference-selectmulti",
		kind: "Component",
		title: "SelectMulti",
		description:
			'Mode "one" submits a string. Mode "many" submits an array. Set searchable to false to hide search. The async fetcher loads local sample data.',
		language: "tsx",
		text: `import { Button, Form, SelectMulti } from "nano-ux";
import { useState } from "react";
import { useForm } from "react-hook-form";

type ColorFormValues = {
  color: string;
  colors: string[];
  colorsWithoutSearch: string[];
  asyncColors: string[];
};

export const ColorForm = () => {
  const form = useForm<ColorFormValues>({
    defaultValues: { color: "", colors: [], colorsWithoutSearch: [], asyncColors: [] },
  });
  const [fetcher, setFetcher] = useState(() => loadColors);
  const [savedColors, setSavedColors] = useState<ColorFormValues>();
  const reloadOptions = () => setFetcher(() => () => loadColors());

  return (
    <Form className="grid gap-3" form={form} onSubmit={setSavedColors}>
      <SelectMulti name="color" label="Single selection"
        mode="one" options={options} searchable={false} />
      <SelectMulti name="colors" label="Multiple selection"
        mode="many" options={options} />
      <SelectMulti name="colorsWithoutSearch" label="Multiple selection without search"
        mode="many" options={options} searchable={false} />
      <div className="relative">
        <SelectMulti name="asyncColors" label="Async options"
          mode="many" fetcher={fetcher} />
        <button className="anchor absolute end-0 top-0 text-sm" type="button"
          onClick={reloadOptions}>
          Reload options
        </button>
      </div>
      <Button className="justify-self-end" type="submit">Save</Button>
      {!!savedColors && (
        <output className="font-mono text-sm whitespace-pre-wrap">
          {JSON.stringify(savedColors, null, 2)}
        </output>
      )}
    </Form>
  );
};

const loadColors = async () => {
  const { promise, resolve } = Promise.withResolvers<void>();

  window.setTimeout(resolve, 2000);
  await promise;
  return options;
};

const options = [${colorOptions.map(({ label }) => JSON.stringify(label)).join(", ")}].map((label) => ({ label, value: label.toLowerCase() }));`,
		preview: <ReferenceFormPreview />,
	},
	{
		id: "reference-button",
		kind: "Component",
		title: "Button",
		description:
			"Choose solid, outline, or ghost with variant. Set loading during an async action to show a spinner and prevent repeat clicks.",
		language: "tsx",
		text: saveButtonSource,
		preview: <SaveButton />,
	},
	{
		id: "reference-accordion",
		kind: "Component",
		title: "Accordion",
		description:
			"Use title for the trigger and summary for text visible when collapsed. Set defaultExpanded to open the panel on first render.",
		language: "tsx",
		text: billingDetailsSource,
		preview: <BillingDetails />,
	},
	{
		id: "reference-tooltip",
		kind: "Component",
		title: "Tooltip",
		description:
			"Wrap one trigger with Tooltip. Hover or focus it with the keyboard to show content. Set placement to top or bottom.",
		language: "tsx",
		text: accordionLinkSource,
		preview: <AccordionLink />,
	},
	{
		id: "reference-chart-line",
		kind: "Component",
		title: "ChartLine",
		description:
			"Use ISO timestamps and list values in series order. Set interval to match the data and use valueFormatter to format values.",
		language: "tsx",
		text: dailySignupsSource,
		preview: (
			<ReferenceLazyPreview className="h-56">
				<DailySignups />
			</ReferenceLazyPreview>
		),
	},
	{
		id: "reference-chart-bar",
		kind: "Component",
		title: "ChartBar",
		description:
			"Provide one value per series in series order. Use Compare paid signups to add a second bar per category. Set stacked to false to keep both bars side by side.",
		language: "tsx",
		text: signupsBySourceSource,
		preview: (
			<ReferenceLazyPreview className="min-h-72">
				<SignupsBySource />
			</ReferenceLazyPreview>
		),
	},
	{
		id: "reference-chart-pie",
		kind: "Component",
		title: "ChartPie",
		description:
			"Provide a name and value for each slice. Enable showLegend to display each slice as a percentage of the total.",
		language: "tsx",
		text: signupsByPlanSource,
		preview: (
			<ReferenceLazyPreview className="h-56">
				<SignupsByPlan />
			</ReferenceLazyPreview>
		),
	},
	{
		id: "reference-world-map",
		kind: "Component",
		title: "WorldMap",
		description:
			"Use two-letter country codes and intensities from 0 to 100. Give the container an aspect ratio to preserve the map shape.",
		language: "tsx",
		text: signupsByCountrySource,
		preview: (
			<ReferenceLazyPreview className="aspect-[802/405]">
				<SignupsByCountry />
			</ReferenceLazyPreview>
		),
	},
	{
		id: "reference-table",
		kind: "Component",
		title: "Table",
		description: (
			<>
				Use Table for rows already loaded in memory. Set sortableColumns to
				enable sorting. Use <a href="#reference-table-virtual">TableVirtual</a>{" "}
				for infinite loading.
			</>
		),
		language: "tsx",
		text: profileTableSource,
		preview: <ProfileTable />,
	},
	{
		id: "reference-table-virtual",
		kind: "Component",
		title: "TableVirtual",
		description:
			"The preview shows all 10,000 matching users while loading 50 rows at a time. The example imports countProfiles and listProfiles from your application. Use Repository.count with the same filters as listProfiles. Apply pagination only to listProfiles.",
		language: "tsx",
		text: `import { createColumnHelper, TableVirtual, type tableVirtualFeatures, useInfiniteTable } from "nano-ux";
import useSWR from "swr";
import { countProfiles, listProfiles } from "./profiles-api";

type Profile = { name: string; email: string };
const column = createColumnHelper<typeof tableVirtualFeatures, Profile>();
const columns = column.columns([
  column.accessor("name", { header: "Name" }),
  column.accessor("email", { header: "Email" }),
]);

type ProfileListProps = { search: string; className?: string };

export const ProfileList = ({ search, className = "h-96" }: ProfileListProps) => {
  const { data: total } = useSWR(["profiles/count", search], () =>
    countProfiles({ search }),
  );

  const { tableKey, tableProps } = useInfiniteTable<Profile>({
    key: ["profiles", search],
    pageSize: 50,
    fetchPage: ({ offset, limit }) => listProfiles({ search, offset, limit }),
  });

  return (
    <TableVirtual
      key={tableKey}
      className={className}
      columns={columns}
      totalCount={total ?? null}
      {...tableProps}
    />
  );
};`,
		preview: <ReferenceTablePreview />,
	},
	{
		id: "reference-use-in-view-once",
		kind: "Hook",
		title: "useInViewOnce",
		description:
			"Attach the ref to a visible element to mount its content the first time it enters the viewport.",
		language: "tsx",
		text: `import { useInViewOnce } from "nano-ux";

export const Activity = () => {
  const { ref, hasEnteredView } = useInViewOnce();

  return (
    <section ref={ref}>
      <h2>Activity</h2>
      {hasEnteredView && <p>Weekly activity is ready.</p>}
    </section>
  );
};`,
	},
	{
		id: "reference-keys-to-date",
		kind: "Function",
		title: "keysToDate",
		description:
			"Format selected date fields in a copy of the record before submitting it.",
		language: "typescript",
		text: `import { keysToDate } from "nano-ux/helpers";

const profile = { birth_date: "1995-04-18T09:30:00" };
const format = keysToDate<typeof profile>(["birth_date"], "YYYY-MM-DD");

const payload = format(profile);
// { birth_date: "1995-04-18" }`,
	},
	{
		id: "reference-init-nav-scroll",
		kind: "Function",
		title: "initNavScroll",
		description:
			"Call once at browser startup to restore the scroll position without animation on back and forward navigation.",
		language: "typescript",
		text: `import { initNavScroll } from "nano-ux/helpers";

initNavScroll();`,
	},
];

const exampleSections = Object.entries({
	Component: "Components",
	Hook: "Hooks",
	Function: "Functions",
}).map(([kind, title]) => ({
	id: kind,
	title,
	entries: examples.filter((example) => example.kind === kind),
}));

const referenceSections = [
	{ id: "CSS", title: "CSS classes", entries: cssReferenceLinks },
	...exampleSections,
].map(({ id, title, entries }) => ({
	id,
	title,
	items: entries.map((entry) => ({
		label: entry.title.split(", ")[0],
		href: `#${entry.id}`,
	})),
}));

const sections = [
	{
		id: "setup",
		title: "Setup",
		items: [
			{ label: "Install", href: "#setup-install" },
			{ label: "Configure the theme", href: "#setup-theme" },
			{ label: "Extend the theme", href: "#setup-extend-theme" },
		],
	},
	...referenceSections,
	{
		id: "ssg",
		title: 'Use "nano-ssg"',
		items: [
			{ label: "Install", href: "#ssg-install" },
			{ label: "Configure Vite", href: "#ssg-config" },
			{ label: "Create a page", href: "#ssg-page" },
			{ label: "Build and preview", href: "#ssg-build" },
		],
	},
	{
		id: "preview",
		title: 'Use "miral"',
		items: [
			{ label: "Install", href: "#preview-install" },
			{ label: "Use the catalog", href: "#preview-catalog" },
			{ label: "Create a preview", href: "#preview-create" },
			{ label: "Run and build", href: "#preview-build" },
		],
	},
];

const themeSettings = [
	{
		name: "--color-brand",
		value: "var(--theme-lime)",
		description:
			"Choose any theme color for primary buttons and controls. It adapts automatically to light and dark modes.",
	},
	{
		name: "--font-family",
		value: "Georgia, serif",
		description:
			"Sets the main typeface. List fallback fonts in order of preference.",
	},
	{
		name: "--tracking",
		value: "0em",
		description:
			"Adjusts the space between letters in body text, labels, and headings.",
	},
	{
		name: "--spacing",
		value: "0.25rem",
		description: "Sets the base unit for padding, margins, and gaps.",
	},
	{
		name: "--radius-control",
		value: "0.375rem",
		description: "Sets the corner radius of buttons and form fields.",
	},
	{
		name: "--radius-card",
		value: "0.625rem",
		description: "Sets the corner radius of cards and panels.",
	},
];

const themeImports = `@import "nano-ux/tailwind.css";
@source "./index.html";
@source "./src";`;

const themeSetup = `${themeImports}

:root {
${themeSettings.map(({ name, value }) => `  ${name}: ${value};`).join("\n")}
}`;

const themeExtension = `${themeImports}

:root {
  --theme-coral: light-dark(#b23a32, #ff9e92);
  --color-brand: var(--theme-coral);
}

@theme inline {
  --color-coral: var(--theme-coral);
}`;

export const Reference = ({ className }: ReferenceProps) => {
	const [currentHref, setCurrentHref] = React.useState("");

	React.useEffect(() => {
		const syncHash = () => setCurrentHref(window.location.hash);

		syncHash();
		window.addEventListener("hashchange", syncHash);
		return () => window.removeEventListener("hashchange", syncHash);
	}, []);

	return (
		<div className={cx("min-w-0 py-12", className)}>
			<h1 className="typo-lg">Documentation</h1>
			<div className="mt-8 grid items-start gap-8 lg:grid-cols-[13rem_minmax(0,1fr)]">
				<SectionNav
					label="Documentation sections"
					sections={sections}
					currentHref={currentHref}
				/>
				<div className="min-w-0">
					<section
						id="setup"
						className="mb-12 grid gap-4"
						aria-labelledby="setup-heading"
					>
						<h2 id="setup-heading">Setup</h2>
						<div id="setup-install" className="scroll-mt-6">
							<h3>Install</h3>
							<Code language="shell" text="npm install nano-ux" />
						</div>
						<div id="setup-theme" className="scroll-mt-6">
							<h3>Configure the theme</h3>
							<figure className="min-w-0">
								<figcaption className="mb-1 font-mono text-xs text-fg-muted">
									index.css
								</figcaption>
								<div className="grid items-start gap-6 md:grid-cols-2">
									<Code language="css" text={themeSetup} />

									<dl className="m-0 grid gap-3 text-sm">
										{themeSettings.map(({ name, description }) => (
											<div key={name}>
												<dt>
													<code>{name}</code>
												</dt>
												<dd>{description}</dd>
											</div>
										))}
									</dl>
								</div>
							</figure>
						</div>
						<div id="setup-extend-theme" className="scroll-mt-6">
							<h3>Extend the theme</h3>
							<figure className="min-w-0">
								<figcaption className="mb-1 font-mono text-xs text-fg-muted">
									index.css
								</figcaption>
								<div className="grid items-start gap-6 md:grid-cols-2">
									<Code language="css" text={themeExtension} />

									<p className="m-0 text-sm">
										In <code>light-dark()</code>, the first value sets the light
										mode color and the second sets the dark mode color. Assign
										it to <code>--color-brand</code> to use it for controls. The{" "}
										<code>@theme inline</code> rule adds Tailwind utilities such
										as <code>bg-coral</code> and <code>text-coral</code>.
									</p>
								</div>
							</figure>
						</div>
					</section>
					<CssClassCatalog />
					{exampleSections.map((section) => (
						<section
							key={section.id}
							className="mt-12 grid gap-8"
							aria-labelledby={`reference-${section.id}-heading`}
						>
							<h2 id={`reference-${section.id}-heading`}>{section.title}</h2>
							{section.entries.map(
								({ id, kind, title, description, language, text, preview }) => (
									<article key={id} id={id} className="min-w-0 scroll-mt-6">
										<h3>
											<span className="reference-kind">{kind}</span> {title}
										</h3>
										<p className="mb-3">{description}</p>
										{!preview && <Code language={language} text={text} />}
										{!!preview && (
											<div className="grid min-w-0 snap-x snap-mandatory auto-cols-[100%] grid-flow-col items-start gap-4 overflow-x-auto md:snap-none md:grid-flow-row md:grid-cols-2 md:overflow-visible">
												<Code
													className="snap-start max-md:[&_pre]:wrap-anywhere max-md:[&_pre]:whitespace-pre-wrap"
													language={language}
													text={text}
												/>
												<div className="min-w-0 snap-start">{preview}</div>
											</div>
										)}
									</article>
								),
							)}
						</section>
					))}
					<section
						id="ssg"
						className="mt-12 grid gap-4"
						aria-labelledby="ssg-heading"
					>
						<h2 id="ssg-heading">Use "nano-ssg"</h2>
						<div id="ssg-install" className="grid min-w-0 scroll-mt-6 gap-2">
							<p>
								Pre-rendered React web application, made easy.
								<br />
								Built on <code>vite</code>, <code>react</code>, and{" "}
								<code>tailwind</code>.
							</p>
							<Code language="shell" text="npm install -D nano-ssg" />
						</div>
						<div id="ssg-config" className="grid min-w-0 scroll-mt-6 gap-2">
							<h3>Configure Vite</h3>
							<p>
								Start with an ESM project that has React 19, React DOM 19, Vite
								8, and nano-ssg installed. Use the preset in{" "}
								<code>vite.config.ts</code>. It reads pages from{" "}
								<code>src/views/</code> and supplies the HTML template and
								browser entry.
							</p>
							<Code
								language="typescript"
								text={'export { default } from "nano-ssg/config";'}
							/>
						</div>
						<div id="ssg-page" className="grid min-w-0 scroll-mt-6 gap-2">
							<h3>Create a page</h3>
							<p>
								Create <code>src/views/Home.page.tsx</code> for the home page.
								Export a component named <code>Page</code>. The optional{" "}
								<code>route.metadata.title</code> sets the browser tab title.
							</p>
							<Code
								language="tsx"
								text={`export const route = { metadata: { title: "Welcome" } };

export const Page = () => (
  <main>
    <h1>Welcome</h1>
  </main>
);`}
							/>
							<p>
								Folders add URL segments. For example,{" "}
								<code>src/views/guides/GettingStarted.page.tsx</code> serves{" "}
								<code>/guides/getting-started</code> and builds to{" "}
								<code>dist/guides/getting-started.html</code>.
							</p>
						</div>
						<div id="ssg-build" className="grid min-w-0 scroll-mt-6 gap-2">
							<h3>Build and preview</h3>
							<p>
								Run <code>npx -y vite</code> and open{" "}
								<code>http://localhost:3000/</code> to see the home page. To
								check the production build, stop the development server and run
								these commands from the project root.
							</p>
							<Code
								language="shell"
								text={"npx -y vite build\nnpx -y vite preview"}
							/>
							<p>
								Open the URL printed by Vite. The home page is in{" "}
								<code>dist/index.html</code>. Deploy the contents of{" "}
								<code>dist/</code> to your static host.
							</p>
						</div>
					</section>
					<section
						id="preview"
						className="mt-12 grid gap-4"
						aria-labelledby="preview-heading"
					>
						<h2 id="preview-heading">Use "miral"</h2>
						<div
							id="preview-install"
							className="grid min-w-0 scroll-mt-6 gap-2"
						>
							<p>
								Like storybook, but opinionated, much simpler, and without
								interaction testing.
								<br />
								Built on <code>vite</code>, <code>react</code>, and{" "}
								<code>tailwind</code>.
							</p>
							<Code language="shell" text="npm install -D miral" />
						</div>
						<div
							id="preview-catalog"
							className="grid min-w-0 scroll-mt-6 gap-2"
						>
							<h3>Use the catalog</h3>
							<p>
								Open the{" "}
								<a
									href={
										import.meta.env.DEV
											? "http://localhost:9000/"
											: "./preview/"
									}
								>
									component catalog
								</a>{" "}
								and select a component in the sidebar. Select{" "}
								<strong>Playground</strong>, when available, to change its props
								and see the result.
							</p>
							<p>
								Choose <strong>Desktop</strong> to fill the available preview
								width. <strong>Tablet</strong> uses a 768 × 1024 viewport and{" "}
								<strong>Smartphone</strong> uses 390 × 844. The toolbar also
								lets you switch themes or enter full screen. Press{" "}
								<kbd>Esc</kbd> to exit full screen.
							</p>
						</div>
						<div id="preview-create" className="grid min-w-0 scroll-mt-6 gap-2">
							<h3>Create a preview</h3>
							<p>
								In a React project with nano-ux and Miral installed, create{" "}
								<code>SaveButton.mira.tsx</code>. The filename sets the sidebar
								label. Export <code>Preview</code> to show the default example.
								The optional <code>section</code> string groups it in the
								sidebar.
							</p>
							<Code
								language="tsx"
								text={`import { Button } from "nano-ux";
import "nano-ux/theme.css";

export const section = "Controls";

export const Preview = () => <Button>Save</Button>;`}
							/>
						</div>
						<div id="preview-build" className="grid min-w-0 scroll-mt-6 gap-2">
							<h3>Run and build</h3>
							<p>
								Use Node.js 24 or later. From the project directory, start the
								catalog and open <code>http://localhost:9000/</code>. Select{" "}
								<strong>SaveButton</strong> under <strong>Controls</strong>.
							</p>
							<Code language="shell" text="npx -y miral preview" />
							<p>
								To publish the catalog, build it into a separate output
								directory and serve that directory on a static host.
							</p>
							<Code
								language="shell"
								text="npx -y miral build --outDir dist/preview"
							/>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
};

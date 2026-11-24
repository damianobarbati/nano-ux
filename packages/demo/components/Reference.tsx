import cx from "clsx-tw";
import { Code, Mockup } from "nano-ux";
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
				src={`${import.meta.env.BASE_URL}theme-preview.html`}
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
];

type ReferenceLink = { id: string; title: string; kind: string };

export const referenceLinks: ReferenceLink[] = [
	...cssReferenceLinks,
	...examples.map(({ id, kind, title }) => ({ id, kind, title })),
];

export const Reference = ({ className }: ReferenceProps) => {
	return (
		<section
			id="reference"
			className={cx("min-w-0 scroll-mt-6 py-12", className)}
		>
			<h2 id="quick-reference" className="typo-lg scroll-mt-6">
				Reference
			</h2>
			<CssClassCatalog className="mt-8" />
			<div className="mt-12 grid gap-8">
				{examples.map(
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
			</div>
		</section>
	);
};

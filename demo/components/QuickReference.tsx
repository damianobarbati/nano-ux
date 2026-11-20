import React from "react";
import { Code } from "../../src/components/Code.tsx";

const examples = [
	{
		kind: "Hook",
		title: "useInViewOnce",
		description:
			"Attach the ref to a visible element to mount its content the first time it enters the viewport.",
		language: "tsx",
		text: `import { useInViewOnce } from "nano-ui";

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
		kind: "Components",
		title: "Form + SelectMulti",
		description:
			'Read the submitted field by name. Mode "one" returns a string and mode "many" returns an array.',
		language: "tsx",
		text: `import { Form, SelectMulti } from "nano-ui";
import { useForm } from "react-hook-form";

export const ColorForm = () => {
  const form = useForm({ defaultValues: { color: "" } });

  return (
    <Form form={form} onSubmit={({ color }) => console.log(color)}>
      <SelectMulti name="color" label="Color" mode="one"
        options={[{ label: "Blue", value: "blue" }]} />
      <button type="submit">Save</button>
    </Form>
  );
};`,
	},
	{
		kind: "Function",
		title: "keysToDate",
		description:
			"Format selected date fields in a copy of the record before submitting it.",
		language: "typescript",
		text: `import { keysToDate } from "nano-ui/helpers";

const profile = { birth_date: "1995-04-18T09:30:00" };
const format = keysToDate<typeof profile>(["birth_date"], "YYYY-MM-DD");

const payload = format(profile);
// { birth_date: "1995-04-18" }`,
	},
	{
		kind: "Component",
		title: "Toast",
		description:
			"Set the duration in milliseconds and use the close reason to restore focus after manual dismissal.",
		language: "tsx",
		text: `import { Toast } from "nano-ui";
import { useState } from "react";

export const Notice = () => {
  const [trigger, setTrigger] = useState<HTMLButtonElement>();

  return <>
    <button onClick={e => setTrigger(e.currentTarget)}>Show toast</button>
    {trigger && <Toast message="Saved" duration={5000}
      onClose={reason => {
        if (reason === "dismiss") trigger.focus();
        setTrigger(undefined);
      }} />}
  </>;
};`,
	},
	{
		kind: "Module",
		title: "nano-ui/theme",
		description:
			"Restore the saved theme on startup, then apply and save the next preference when the user switches themes.",
		language: "typescript",
		text: `import { applyTheme, getTheme, nextTheme, saveTheme } from "nano-ui/theme";

applyTheme({ theme: getTheme() });

export const switchTheme = () => {
  const theme = nextTheme({ theme: getTheme() });
  applyTheme({ theme });
  saveTheme({ theme });
};`,
	},
	{
		kind: "Component",
		title: "TableVirtual + useInfiniteTable",
		description:
			"Load the next 50 profiles as you scroll. Include every active filter in the key. Loading stops when the API returns fewer than 50 rows.",
		language: "tsx",
		text: `import { createColumnHelper, TableVirtual, type tableVirtualFeatures, useInfiniteTable } from "nano-ui";

type Profile = { name: string; email: string };
const column = createColumnHelper<typeof tableVirtualFeatures, Profile>();
const columns = column.columns([
  column.accessor("name", { header: "Name" }),
  column.accessor("email", { header: "Email" }),
]);

export const ProfileList = ({ search }: { search: string }) => {
  const { tableKey, tableProps, error, mutate } = useInfiniteTable<Profile>({
    key: ["/api/profiles", search],
    pageSize: 50,
    fetchPage: async ({ offset, limit }) => {
      const params = new URLSearchParams({
        search, page: String(offset / limit + 1), limit: String(limit),
      });
      const response = await fetch("/api/profiles?" + params);
      if (!response.ok) throw new Error("Could not load profiles.");
      return response.json();
    },
  });

  return (
    <>
      <TableVirtual
        key={tableKey}
        columns={columns}
        className="h-96"
        emptyMessage="No profiles found."
        {...tableProps}
      />
      {error && <p role="alert">{error.message}{" "}
        <button type="button" onClick={() => mutate()}>Retry</button>
      </p>}
    </>
  );
};`,
	},
];

export const QuickReference = () => (
	<section id="quick-reference" className="min-w-0 scroll-mt-6 py-12">
		<h2 className="typo-lg">Quick reference</h2>
		<div className="mt-6 grid gap-8 lg:grid-cols-2">
			{examples.map(({ kind, title, description, language, text }) => (
				<article key={title} className="min-w-0">
					<h3>
						<span className="text-sm font-medium text-fg-muted">{kind}</span>{" "}
						{title}
					</h3>
					<p className="mb-3">{description}</p>
					<Code language={language} text={text} />
				</article>
			))}
		</div>
	</section>
);

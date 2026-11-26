import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod/mini";
import { Button } from "../../components/Button.tsx";
import { Code } from "../../components/Code.tsx";
import { Checkbox } from "../../controls/Checkbox.tsx";
import { Form, FormPropsSchema } from "../../controls/Form.tsx";

import { Input } from "../../controls/Input.tsx";

import { InputSearch } from "../../controls/InputSearch.tsx";

import { InputTime } from "../../controls/InputTime.tsx";

import { Select } from "../../controls/Select.tsx";

import { SelectMulti } from "../../controls/SelectMulti.tsx";

import { Slider } from "../../controls/Slider.tsx";

import { Textarea } from "../../controls/Textarea.tsx";

import { Toggle } from "../../controls/Toggle.tsx";

type FormValues = {
	search: string;
	email: string;
	notes: string;
	document: string;
	tags: string[];
	volume: number;
	accepted: boolean;
	notifications: boolean;
	appointment: string;
	from: string;
	to: string;
};

const defaultValues: FormValues = {
	search: "",
	email: "invalid",
	notes: "",
	document: "passport",
	tags: [],
	volume: 50,
	accepted: false,
	notifications: false,
	appointment: "",
	from: "",
	to: "",
};

const DefaultExample = () => {
	const form = useForm<FormValues>({ defaultValues });
	const [from, to] = form.watch(["from", "to"]);
	const [result, setResult] = React.useState<FormValues | null>(null);
	const { setError } = form;

	React.useEffect(() => {
		setError("email", {
			type: "manual",
			message: "Enter a valid email address.",
		});
	}, [setError]);

	return (
		<section className="card w-full max-w-4xl">
			<Form
				form={form}
				className="grid gap-5 sm:grid-cols-2"
				onSubmit={setResult}
			>
				<InputSearch
					autoFocus
					className="sm:col-span-2"
					label="Search"
					name="search"
					placeholder="Search requests"
				/>
				<Input
					label="Email"
					name="email"
					type="email"
					helpText="Use your work email."
					rules={{
						required: "Email is required.",
						pattern: {
							value: /.+@.+\..+/,
							message: "Enter a valid email address.",
						},
					}}
				/>
				<Select label="Document" name="document">
					<option value="passport">Passport</option>
					<option value="identity-card">Identity card</option>
				</Select>
				<Textarea
					className="sm:col-span-2"
					label="Notes"
					name="notes"
					placeholder="Optional notes"
				/>
				<SelectMulti
					label="Tags"
					name="tags"
					options={[
						{ value: "live", label: "Liveness" },
						{ value: "document", label: "Document" },
						{ value: "disabled", label: "Unavailable", disabled: true },
					]}
					rules={{ validate: (value) => value.length > 0 || "Select a tag." }}
				/>
				<InputTime
					label="Appointment"
					name="appointment"
					type="datetime-local"
				/>
				<Slider
					className="sm:col-span-2"
					name="volume"
					label="Notification volume"
				/>
				<Checkbox
					label="Accept terms"
					name="accepted"
					rules={{ required: "Accept the terms." }}
				/>
				<Toggle label="Email notifications" name="notifications" />
				<fieldset className="flex flex-wrap gap-4 sm:col-span-2">
					<legend className="control-label mb-2">Period</legend>
					<InputTime
						className="min-w-0 flex-1"
						label="From"
						name="from"
						type="date"
						max={to}
					/>
					<InputTime
						className="min-w-0 flex-1"
						label="To"
						name="to"
						type="date"
						min={from}
					/>
				</fieldset>
				<div className="flex gap-3 sm:col-span-2">
					<Button type="submit">Save details</Button>
					<Button
						variant="outline"
						onClick={() => {
							form.reset(defaultValues);
							setResult(null);
						}}
					>
						Reset
					</Button>
				</div>
			</Form>
			{result && (
				<Code
					className="mt-6 text-xs"
					language="json"
					text={JSON.stringify(result, null, 2)}
				/>
			)}
		</section>
	);
};

const DisabledExample = () => {
	const form = useForm({
		defaultValues: {
			...defaultValues,
			email: "jane@example.com",
			document: "Passport",
			accepted: true,
			notifications: true,
		},
	});

	return (
		<FormProvider {...form}>
			<section className="card w-full max-w-4xl">
				<div className="grid gap-5 sm:grid-cols-2">
					<InputSearch
						name="search"
						className="sm:col-span-2"
						label="Search"
						placeholder="Search requests"
						disabled
					/>
					<Input name="email" label="Email" disabled />
					<Select name="document" label="Document" disabled>
						<option>Passport</option>
					</Select>
					<Textarea
						name="notes"
						className="sm:col-span-2"
						label="Notes"
						disabled
					/>
					<SelectMulti name="tags" label="Tags" options={[]} disabled />
					<Slider name="volume" label="Notification volume" disabled />
					<Checkbox name="accepted" label="Accepted" disabled />
					<Toggle name="notifications" label="Email notifications" disabled />
				</div>
			</section>
		</FormProvider>
	);
};

export const Preview = () => (
	<div className="grid gap-8">
		<section>
			<h2>Default</h2>
			<DefaultExample />
		</section>
		<section>
			<h2>Disabled</h2>
			<DisabledExample />
		</section>
	</div>
);

export const schema = z.pick(FormPropsSchema, {
	noValidate: true,
	className: true,
});

export const Playground = (props: z.infer<typeof schema>) => {
	const form = useForm();
	return (
		<Form form={form} onSubmit={() => {}} {...props}>
			<Input name="example" label="Name" />
			<Button type="submit">Save</Button>
		</Form>
	);
};

export const section = "Controls";

import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod/mini";
import { Select, SelectPropsSchema } from "../../controls/Select.tsx";

import { AsyncSelectExample } from "../AsyncSelectExample.tsx";

export const Preview = () => {
	const form = useForm({
		defaultValues: {
			website: "Website selector",
			asyncWebsite: "website.test",
		},
	});

	return (
		<FormProvider {...form}>
			<div className="grid w-64 gap-4">
				<Select name="website" label="Default">
					<option>Website selector</option>
					<option>example.com</option>
				</Select>
				<AsyncSelectExample>
					{(fetcher) => (
						<Select name="asyncWebsite" label="Async" fetcher={fetcher} />
					)}
				</AsyncSelectExample>
			</div>
		</FormProvider>
	);
};

export const schema = z.pick(SelectPropsSchema, {
	label: true,
	helpText: true,
	disabled: true,
});

export const defaults = { label: "Select" };

export const Playground = (props: z.infer<typeof schema>) => {
	const form = useForm();

	return (
		<FormProvider {...form}>
			<Select name="example" children={<option>Example</option>} {...props} />
		</FormProvider>
	);
};

export const section = "Controls";

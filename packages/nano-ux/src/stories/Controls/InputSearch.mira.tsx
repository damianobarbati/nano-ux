import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod/mini";

import {
	InputSearch,
	InputSearchPropsSchema,
} from "../../controls/InputSearch.tsx";

export const Preview = () => {
	const form = useForm({ defaultValues: { search: "" } });
	return (
		<FormProvider {...form}>
			<form role="search" onSubmit={(event) => event.preventDefault()}>
				<InputSearch name="search" label="Cerca progetti" />
			</form>
		</FormProvider>
	);
};

export const schema = z.pick(InputSearchPropsSchema, {
	label: true,
	helpText: true,
	disabled: true,
	placeholder: true,
});

export const defaults = { label: "InputSearch" };

export const Playground = (props: z.infer<typeof schema>) => {
	const form = useForm();
	return (
		<FormProvider {...form}>
			<InputSearch name="example" {...props} />
		</FormProvider>
	);
};

export const section = "Controls";

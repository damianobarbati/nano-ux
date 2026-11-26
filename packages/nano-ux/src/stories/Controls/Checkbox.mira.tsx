import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod/mini";
import { Checkbox, CheckboxPropsSchema } from "../../controls/Checkbox.tsx";

const Example = () => {
	const form = useForm({
		defaultValues: { terms: false, accepted: true, disabled: false },
	});

	return (
		<FormProvider {...form}>
			<div className="space-y-4">
				<Checkbox label="Terms" name="terms" />
				<Checkbox label="Accepted terms" name="accepted" />
				<Checkbox label="Disabled checkbox" name="disabled" disabled />
			</div>
		</FormProvider>
	);
};

export const Preview = () => <Example />;

export const schema = z.pick(CheckboxPropsSchema, {
	label: true,
	helpText: true,
	disabled: true,
});

export const defaults = { label: "Checkbox" };

export const Playground = (props: z.infer<typeof schema>) => {
	const form = useForm();

	return (
		<FormProvider {...form}>
			<Checkbox name="example" {...props} />
		</FormProvider>
	);
};

export const section = "Controls";

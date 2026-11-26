import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod/mini";
import { Input, InputPropsSchema } from "../../controls/Input.tsx";

export const Preview = () => {
	const form = useForm({
		defaultValues: {
			defaultInput: "",
			errorInput: "",
			disabledInput: "Disabled input",
		},
	});

	return (
		<FormProvider {...form}>
			<div className="w-80 space-y-4">
				<Input
					name="defaultInput"
					label="Default input"
					placeholder="Default input"
				/>
				<Input
					name="errorInput"
					aria-invalid="true"
					placeholder="Error input"
				/>
				<Input name="disabledInput" disabled />
			</div>
		</FormProvider>
	);
};

export const schema = z.pick(InputPropsSchema, {
	label: true,
	helpText: true,
	disabled: true,
	placeholder: true,
});

export const defaults = { label: "Input" };

export const Playground = (props: z.infer<typeof schema>) => {
	const form = useForm();

	return (
		<FormProvider {...form}>
			<Input name="example" {...props} />
		</FormProvider>
	);
};

export const section = "Controls";

import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod/mini";

import { InputTime, InputTimePropsSchema } from "../../controls/InputTime.tsx";

const Example = () => {
	const form = useForm({
		defaultValues: {
			birthDate: "2000-01-15T00:00:00.000Z",
			appointment: "2026-09-25T10:30:00.000Z",
		},
	});

	return (
		<FormProvider {...form}>
			<div className="w-80 space-y-4">
				<InputTime label="Birth date" name="birthDate" type="date" />
				<InputTime
					label="Appointment"
					name="appointment"
					type="datetime-local"
				/>
			</div>
		</FormProvider>
	);
};

export const Preview = () => <Example />;

export const schema = z.pick(InputTimePropsSchema, {
	label: true,
	helpText: true,
	disabled: true,
	type: true,
});

export const defaults = { label: "InputTime", type: "date" };

export const Playground = (props: z.infer<typeof schema>) => {
	const form = useForm();
	return (
		<FormProvider {...form}>
			<InputTime name="example" {...props} />
		</FormProvider>
	);
};

export const section = "Controls";

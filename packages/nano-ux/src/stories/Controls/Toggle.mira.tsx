import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod/mini";
import { Toggle, TogglePropsSchema } from "../../controls/Toggle.tsx";

export const Preview = () => {
	const form = useForm({
		defaultValues: { email: true, marketing: true, unavailable: false },
	});

	return (
		<FormProvider {...form}>
			<div className="grid gap-5">
				<Toggle label="Email notifications" name="email" />
				<Toggle label="Marketing updates" name="marketing" />
				<Toggle label="Unavailable option" name="unavailable" disabled />
			</div>
		</FormProvider>
	);
};

export const schema = z.pick(TogglePropsSchema, {
	label: true,
	helpText: true,
	disabled: true,
});

export const defaults = { label: "Toggle" };

export const Playground = (props: z.infer<typeof schema>) => {
	const form = useForm();
	return (
		<FormProvider {...form}>
			<Toggle name="example" {...props} />
		</FormProvider>
	);
};

export const section = "Controls";

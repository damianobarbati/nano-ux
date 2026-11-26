import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod/mini";
import { Textarea, TextareaPropsSchema } from "../../controls/Textarea.tsx";

export const Preview = () => {
	const form = useForm({
		defaultValues: { message: "", disabled: "Disabled message" },
	});

	return (
		<FormProvider {...form}>
			<div className="w-80 space-y-4">
				<Textarea name="message" placeholder="Your message" />
				<Textarea name="disabled" disabled />
			</div>
		</FormProvider>
	);
};

export const schema = z.pick(TextareaPropsSchema, {
	label: true,
	helpText: true,
	disabled: true,
	placeholder: true,
});

export const defaults = { label: "Textarea" };

export const Playground = (props: z.infer<typeof schema>) => {
	const form = useForm();
	return (
		<FormProvider {...form}>
			<Textarea name="example" {...props} />
		</FormProvider>
	);
};

export const section = "Controls";

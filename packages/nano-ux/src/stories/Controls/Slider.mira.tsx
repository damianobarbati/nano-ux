import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod/mini";
import { Slider, SliderPropsSchema } from "../../controls/Slider.tsx";

export const Preview = () => {
	const form = useForm({ defaultValues: { volume: 50, disabledVolume: 25 } });
	return (
		<FormProvider {...form}>
			<div className="w-64 space-y-4">
				<Slider name="volume" label="Volume" />
				<Slider name="disabledVolume" label="Disabled volume" disabled />
			</div>
		</FormProvider>
	);
};

export const schema = z.pick(SliderPropsSchema, {
	label: true,
	helpText: true,
	disabled: true,
});

export const defaults = { label: "Slider" };

export const Playground = (props: z.infer<typeof schema>) => {
	const form = useForm();
	return (
		<FormProvider {...form}>
			<Slider name="example" {...props} />
		</FormProvider>
	);
};

export const section = "Controls";

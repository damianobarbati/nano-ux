import { FormProvider, useForm } from "react-hook-form";
import { Slider } from "../components/Slider.tsx";

export default { title: "Controls / Slider", component: Slider };

export const Variants = {
	name: "Slider",
	render: () => {
		const form = useForm({ defaultValues: { volume: 50, disabledVolume: 25 } });
		return (
			<FormProvider {...form}>
				<div className="w-64 space-y-4">
					<Slider name="volume" label="Volume" />
					<Slider name="disabledVolume" label="Disabled volume" disabled />
				</div>
			</FormProvider>
		);
	},
};

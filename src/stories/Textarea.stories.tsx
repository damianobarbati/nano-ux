import { FormProvider, useForm } from "react-hook-form";
import { Textarea } from "../components/Textarea.tsx";

export default { title: "Controls / Textarea", component: Textarea };

export const Variants = {
	name: "Textarea",
	render: () => {
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
	},
};

import { FormProvider, useForm } from "react-hook-form";
import { Toggle } from "../components/Toggle.tsx";

export default { title: "Controls / Toggle", component: Toggle };

export const Variants = {
	name: "Toggle",
	render: () => {
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
	},
};

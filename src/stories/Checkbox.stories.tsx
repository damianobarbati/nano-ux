import { FormProvider, useForm } from "react-hook-form";
import { Checkbox } from "../components/Checkbox.tsx";

export default { title: "Controls / Checkbox", component: Checkbox };

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

export const Variants = { name: "Checkbox", render: () => <Example /> };

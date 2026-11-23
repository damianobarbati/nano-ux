import { FormProvider, useForm } from "react-hook-form";
import { Select } from "../components/Select.tsx";
import { AsyncSelectExample } from "./AsyncSelectExample.tsx";

export default { title: "Controls / Select", component: Select };

export const Default = {
	name: "Select",
	render: () => {
		const form = useForm({
			defaultValues: {
				website: "Website selector",
				asyncWebsite: "website.test",
			},
		});

		return (
			<FormProvider {...form}>
				<div className="grid w-64 gap-4">
					<Select name="website" label="Default">
						<option>Website selector</option>
						<option>example.com</option>
					</Select>
					<AsyncSelectExample>
						{(fetcher) => (
							<Select name="asyncWebsite" label="Async" fetcher={fetcher} />
						)}
					</AsyncSelectExample>
				</div>
			</FormProvider>
		);
	},
};

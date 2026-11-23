import { FormProvider, useForm } from "react-hook-form";
import { InputSearch } from "../components/InputSearch.tsx";

export default { title: "Controls / InputSearch", component: InputSearch };

export const InputSearchExample = () => {
	const form = useForm({ defaultValues: { search: "" } });
	return (
		<FormProvider {...form}>
			<form role="search" onSubmit={(event) => event.preventDefault()}>
				<InputSearch name="search" label="Cerca progetti" />
			</form>
		</FormProvider>
	);
};

InputSearchExample.storyName = "InputSearch";

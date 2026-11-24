import cx from "clsx-tw";
import { Button, Form, Input } from "nano-ux";
import React from "react";
import { useForm } from "react-hook-form";

type ProfileFormProps = { className?: string };

export const ProfileForm = ({ className }: ProfileFormProps) => {
	const form = useForm({ defaultValues: { name: "" } });
	const [savedName, setSavedName] = React.useState("");
	return (
		<Form
			className={cx("grid gap-3", className)}
			form={form}
			onSubmit={async ({ name }) => {
				const { promise, resolve } = Promise.withResolvers<void>();

				window.setTimeout(resolve, 300);
				await promise;
				setSavedName(name);
			}}
		>
			<Input name="name" label="Name" rules={{ required: "Enter a name." }} />
			<Button
				className="justify-self-start"
				type="submit"
				loading={form.formState.isSubmitting}
			>
				Save
			</Button>
			{!!savedName && <p role="status">Saved {savedName}</p>}
		</Form>
	);
};

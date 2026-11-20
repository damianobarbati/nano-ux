"use client";

import cx from "clsx-tw";
import type React from "react";
import { type FormFieldProps, useFormField } from "../hooks/useFormField.ts";
import { FieldMessage } from "./FieldMessage.tsx";

export type CheckboxProps = Omit<
	React.ComponentPropsWithRef<"input">,
	"type" | "checked"
> &
	FormFieldProps;

export const Checkbox = ({
	className,
	label,
	helpText,
	error,
	name,
	rules,
	id,
	ref,
	onChange,
	onBlur,
	...props
}: CheckboxProps) => {
	const field = useFormField({
		id,
		name,
		error,
		rules,
		ref,
		onChange,
		onBlur,
	});

	const registration = field.registration;
	return (
		<label
			className={cx(
				"flex flex-wrap items-center gap-2 text-sm text-fg has-disabled:cursor-not-allowed has-disabled:text-fg-muted",
				className,
			)}
			htmlFor={field.id}
		>
			<input
				{...props}
				{...registration}
				id={field.id}
				type="checkbox"
				className="control-checkbox"
				aria-invalid={Boolean(field.error) || props["aria-invalid"]}
			/>
			{label}
			<FieldMessage error={field.error} helpText={helpText} />
		</label>
	);
};

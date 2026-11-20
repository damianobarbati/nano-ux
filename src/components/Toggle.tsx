"use client";

import cx from "clsx-tw";
import type React from "react";
import { type FormFieldProps, useFormField } from "../hooks/useFormField.ts";
import { FieldMessage } from "./FieldMessage.tsx";

export type ToggleProps = Omit<
	React.ComponentPropsWithRef<"input">,
	"type" | "checked"
> &
	FormFieldProps;

export const Toggle = ({
	strings,
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
}: ToggleProps) => {
	const field = useFormField({
		id,
		strings,
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
				"flex cursor-pointer flex-wrap items-center gap-3 text-sm text-fg has-disabled:cursor-not-allowed has-disabled:text-fg-muted",
				className,
			)}
			htmlFor={field.id}
		>
			<input
				{...props}
				{...registration}
				id={field.id}
				type="checkbox"
				className="peer sr-only"
				aria-invalid={Boolean(field.error) || props["aria-invalid"]}
			/>
			{label}
			<span className="relative h-5 w-9 shrink-0 rounded-full bg-border transition-colors peer-checked:bg-fg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-fg peer-disabled:opacity-50 after:absolute after:top-0.5 after:left-0.5 after:size-4 after:rounded-full after:border after:border-border after:bg-surface after:transition-transform peer-checked:after:translate-x-4" />
			<FieldMessage error={field.error} helpText={helpText} />
		</label>
	);
};

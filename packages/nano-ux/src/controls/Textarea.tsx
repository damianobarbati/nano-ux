"use client";

import type React from "react";
import * as z from "zod/mini";

import {
	controlPropsSchema,
	type FormFieldProps,
	useFormField,
} from "../hooks/useFormField.ts";

import { Field } from "./Field.tsx";

export const TextareaPropsSchema = z.extend(controlPropsSchema, {
	placeholder: z.optional(z.string()),
});

export type TextareaProps = z.infer<typeof TextareaPropsSchema> &
	(Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "value"> &
		FormFieldProps & { ref?: React.Ref<HTMLTextAreaElement> });

export const Textarea = ({
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
}: TextareaProps) => {
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
		<Field
			className={className}
			id={field.id}
			label={label}
			helpText={helpText}
			error={field.error}
		>
			<textarea
				{...props}
				{...registration}
				className="control-field min-h-24 resize-y"
				id={field.id}
				aria-invalid={Boolean(field.error) || props["aria-invalid"]}
			/>
		</Field>
	);
};

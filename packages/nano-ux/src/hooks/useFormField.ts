"use client";

import React from "react";
import { type RegisterOptions, useFormContext } from "react-hook-form";
import * as z from "zod/mini";

export const FormFieldPropsSchema = z.object({
	name: z.string(),
	strings: z.optional(z.object({ invalidValue: z.optional(z.string()) })),
	label: z.optional(z.string()),
	helpText: z.optional(z.string()),
	error: z.optional(z.string()),
	rules: z.optional(z.custom<RegisterOptions>()),
});

export type FormFieldProps = z.infer<typeof FormFieldPropsSchema>;

export const controlPropsSchema = z.extend(FormFieldPropsSchema, {
	className: z.optional(z.string()),
	disabled: z.optional(z.boolean()),
});

type FieldElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

type UseFormFieldInput<T extends FieldElement> = Pick<
	FormFieldProps,
	"name" | "error" | "rules" | "strings"
> & {
	id?: string;
	ref?: React.Ref<T>;
	onChange?: React.ChangeEventHandler<T>;
	onBlur?: React.FocusEventHandler<T>;
};

export const useFormField = <T extends FieldElement>({
	id,
	strings,
	name,
	error,
	rules,
	ref,
	onChange,
	onBlur,
}: UseFormFieldInput<T>) => {
	const generatedId = React.useId();
	const form = useFormContext();
	const registration = form.register(name, rules);

	const fieldError = form.getFieldState(name, form.formState).error;

	const message =
		error ??
		(fieldError
			? fieldError.message || (strings?.invalidValue ?? "Enter a valid value.")
			: undefined);

	const inputId = id || generatedId;
	return {
		id: inputId,
		error: message,
		registration: {
			...registration,
			onChange(event: React.ChangeEvent<T>) {
				void registration.onChange(event);
				onChange?.(event);
			},
			onBlur(event: React.FocusEvent<T>) {
				void registration.onBlur(event);
				onBlur?.(event);
			},
			ref(element: T | null): void | (() => void) {
				registration.ref(element);

				if (typeof ref === "function") return ref(element);

				if (ref) ref.current = element;
			},
		},
	};
};

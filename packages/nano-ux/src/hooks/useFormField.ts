"use client";

import React from "react";
import { type RegisterOptions, useFormContext } from "react-hook-form";

export type FormFieldProps = {
	name: string;
	strings?: { invalidValue?: string };
	label?: string;
	helpText?: string;
	error?: string;
	rules?: RegisterOptions;
};

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

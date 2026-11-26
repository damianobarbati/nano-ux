"use client";

import type React from "react";
import * as z from "zod/mini";

import {
	controlPropsSchema,
	type FormFieldProps,
	useFormField,
} from "../hooks/useFormField.ts";

import { Field } from "./Field.tsx";

export const SliderPropsSchema = z.omit(controlPropsSchema, { rules: true });

export type SliderProps = z.infer<typeof SliderPropsSchema> &
	(Omit<React.ComponentProps<"input">, "type" | "value"> &
		Omit<FormFieldProps, "rules"> & {
			rules?: Omit<
				NonNullable<FormFieldProps["rules"]>,
				"valueAsNumber" | "valueAsDate" | "pattern" | "setValueAs"
			>;
		});

export const Slider = ({
	strings,
	className,
	label,
	helpText,
	error,
	id,
	name,
	rules,
	ref,
	onChange,
	onBlur,
	...props
}: SliderProps) => {
	const field = useFormField<HTMLInputElement>({
		id,
		strings,
		name,
		error,
		rules: { valueAsNumber: true, ...rules },
		ref,
		onChange,
		onBlur,
	});

	return (
		<Field
			className={className}
			id={field.id}
			label={label}
			helpText={helpText}
			error={field.error}
		>
			<input
				{...props}
				{...field.registration}
				className="h-10 w-full min-w-0 cursor-pointer accent-[var(--color-brand,var(--theme-fg))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-50"
				id={field.id}
				type="range"
				aria-invalid={Boolean(field.error) || props["aria-invalid"]}
			/>
		</Field>
	);
};

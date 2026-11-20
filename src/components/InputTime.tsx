"use client";

import React from "react";
import { useController } from "react-hook-form";

import { type FormFieldProps } from "../hooks/useFormField.ts";

import { Field } from "./Field.tsx";

export type InputTimeProps = Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	"type" | "value" | "defaultValue" | "onChange" | "min" | "max"
> &
	FormFieldProps & {
		min?: string;
		max?: string;
		type: "date" | "datetime-local";
		defaultValue?: string;
		onChange?: (value: string) => void;
		endOfDay?: boolean;
	};

const formatLocal = ({
	value,
	type,
}: {
	value?: string;
	type: InputTimeProps["type"];
}) => {
	if (!value) return "";

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "";

	const year = String(date.getFullYear()).padStart(4, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const formatted = `${year}-${month}-${day}`;

	if (type === "date") return formatted;

	const dateTime = `${formatted}T${hours}:${minutes}`;
	return dateTime;
};

export const InputTime = ({
	className,
	label,
	helpText,
	error: customError,
	rules,
	name,
	type,
	id,
	defaultValue = "",
	min,
	max,
	onChange,
	endOfDay = false,
	onBlur,
	...props
}: InputTimeProps) => {
	const generatedId = React.useId();
	const inputId = id || generatedId;

	const { field, fieldState } = useController({
		name,
		rules,
		defaultValue,
		disabled: props.disabled,
	});

	const error =
		customError ??
		(fieldState.error && (fieldState.error.message || "Enter a valid value."));

	return (
		<Field
			className={className}
			id={inputId}
			label={label}
			helpText={helpText}
			error={error}
		>
			<input
				{...props}
				className="control-field"
				id={inputId}
				name={name}
				type={type}
				ref={field.ref}
				disabled={field.disabled}
				onBlur={(event) => {
					field.onBlur();
					onBlur?.(event);
				}}
				value={formatLocal({ value: field.value, type })}
				min={formatLocal({ value: min, type }) || undefined}
				max={formatLocal({ value: max, type }) || undefined}
				aria-invalid={Boolean(error) || props["aria-invalid"]}
				onChange={(event) => {
					const rawValue = event.target.value;
					let nextValue = "";

					if (rawValue) {
						const date = new Date(
							type === "date" ? `${rawValue}T00:00` : rawValue,
						);

						if (Number.isNaN(date.getTime())) return;

						if (type === "date" && endOfDay) date.setHours(23, 59, 59, 999);
						nextValue = date.toISOString();
					}

					field.onChange(nextValue);

					if (onChange) onChange(nextValue);
				}}
			/>
		</Field>
	);
};

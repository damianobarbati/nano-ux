"use client";

import cx from "clsx-tw";
import React from "react";
import { useWatch } from "react-hook-form";
import * as z from "zod/mini";

import {
	controlPropsSchema,
	type FormFieldProps,
	useFormField,
} from "../hooks/useFormField.ts";

import { IClose } from "../icons.tsx";
import { Field } from "./Field.tsx";

export const InputPropsSchema = z.extend(controlPropsSchema, {
	placeholder: z.optional(z.string()),
});

export type InputProps = z.infer<typeof InputPropsSchema> &
	(Omit<React.InputHTMLAttributes<HTMLInputElement>, "value"> &
		FormFieldProps & {
			ref?: React.Ref<HTMLInputElement>;
			strings?: { clearSearch?: string };
			leadingIcon?: React.ReactNode;
		});

export const Input = ({
	strings,
	className,
	label,
	helpText,
	error,
	name,
	rules,
	id,
	ref,
	leadingIcon,
	onChange,
	onBlur,
	...props
}: InputProps) => {
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
	const input = React.useRef<HTMLInputElement>(null);
	const isSearch = props.type === "search";

	const searchValue = useWatch({ name, disabled: !isSearch });

	const clear = () => {
		const element = input.current;
		if (!element) return;

		element.value = "";

		const event = {
			target: element,
		} as unknown as React.ChangeEvent<HTMLInputElement>;

		registration.onChange(event);

		element.focus();
	};

	const control = (
		<input
			{...props}
			{...registration}
			className={cx(
				"control-field",
				leadingIcon && "pl-10",
				isSearch && "pr-10",
			)}
			id={field.id}
			aria-invalid={Boolean(field.error) || props["aria-invalid"]}
			ref={(element) => {
				input.current = element;
				return registration.ref(element);
			}}
		/>
	);

	let content = control;

	if (leadingIcon || isSearch) {
		content = (
			<div className="relative">
				{control}
				{!!leadingIcon && (
					<span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-fg-muted">
						{leadingIcon}
					</span>
				)}
				{isSearch && Boolean(searchValue) && (
					<button
						type="button"
						title={strings?.clearSearch ?? "Clear search"}
						className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-fg-muted transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg"
						onClick={clear}
					>
						<IClose className="size-4" />
					</button>
				)}
			</div>
		);
	}

	return (
		<Field
			className={className}
			id={field.id}
			label={label}
			helpText={helpText}
			error={field.error}
		>
			{content}
		</Field>
	);
};

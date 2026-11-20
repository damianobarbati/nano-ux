"use client";

import cx from "clsx-tw";
import type React from "react";
import { type FormFieldProps, useFormField } from "../hooks/useFormField.ts";

import {
	type SelectOptionsFetcher,
	useSelectOptions,
} from "../hooks/useSelectOptions.ts";

import { IChevronDown } from "../icons.tsx";
import { Field } from "./Field.tsx";
import { Spinner } from "./Spinner.tsx";

export type SelectProps = Omit<
	React.SelectHTMLAttributes<HTMLSelectElement>,
	"value"
> &
	FormFieldProps & {
		strings?: { loading?: string; empty?: string; loadError?: string };
		ref?: React.Ref<HTMLSelectElement>;
	} & (
		| { fetcher: SelectOptionsFetcher; children?: never }
		| { fetcher?: undefined; children?: React.ReactNode }
	);

export const Select = ({
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
	fetcher,
	children,
	...props
}: SelectProps) => {
	const {
		options,
		loading,
		error: loadError,
	} = useSelectOptions(fetcher, strings?.loadError);

	const field = useFormField({
		id,
		strings,
		name,
		error: loadError ?? error,
		rules,
		ref,
		onChange,
		onBlur,
	});

	const registration = field.registration;
	let optionElements = children;

	if (fetcher && options?.length) {
		optionElements = options.map((option) => (
			<option
				key={option.value}
				value={option.value}
				disabled={option.disabled}
			>
				{option.label}
			</option>
		));
	} else if (fetcher) {
		optionElements = (
			<option value="" disabled>
				{loading
					? (strings?.loading ?? "Loading options…")
					: (strings?.empty ?? "No options found")}
			</option>
		);
	}

	let indicator;

	if (loading) {
		indicator = (
			<Spinner size="sm" label={strings?.loading ?? "Loading options"} />
		);
	} else {
		indicator = <IChevronDown className="size-4" />;
	}

	return (
		<Field
			className={className}
			id={field.id}
			label={label}
			helpText={helpText}
			error={field.error}
		>
			<div className="relative">
				<select
					key={fetcher && !options?.length ? "pending" : "ready"}
					{...props}
					{...registration}
					className={cx(
						"control-field appearance-none pr-10",
						fetcher &&
							"[contain:inline-size] [contain-intrinsic-inline-size:10rem]",
					)}
					disabled={loading || props.disabled || registration.disabled}
					id={field.id}
					aria-invalid={Boolean(field.error) || props["aria-invalid"]}
					ref={(element) => {
						if (!fetcher || options?.length) return registration.ref(element);

						if (typeof ref === "function") return ref(element);

						if (ref) ref.current = element;
					}}
				>
					{optionElements}
				</select>
				<span className="pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 text-fg-muted">
					{indicator}
				</span>
			</div>
		</Field>
	);
};

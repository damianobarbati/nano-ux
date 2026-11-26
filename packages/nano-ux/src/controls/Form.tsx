"use client";

import type React from "react";

import {
	type FieldValues,
	FormProvider,
	type SubmitErrorHandler,
	type SubmitHandler,
	type UseFormReturn,
} from "react-hook-form";

import * as z from "zod/mini";

export const FormPropsSchema = z.object({
	className: z.optional(z.string()),
	noValidate: z.optional(z.boolean()),
});

export type FormProps<
	TValues extends FieldValues,
	TContext = unknown,
	TOutput = TValues,
> = z.infer<typeof FormPropsSchema> &
	(Omit<React.ComponentProps<"form">, "onSubmit"> & {
		form: UseFormReturn<TValues, TContext, TOutput>;
		onSubmit: SubmitHandler<NoInfer<TOutput>>;
		onSubmitError?: SubmitErrorHandler<NoInfer<TValues>>;
	});

export const Form = <
	TValues extends FieldValues,
	TContext = unknown,
	TOutput = TValues,
>({
	className,
	form,
	onSubmit,
	onSubmitError,
	noValidate = true,
	children,
	...props
}: FormProps<TValues, TContext, TOutput>) => (
	<FormProvider {...form}>
		<form
			className={className}
			{...props}
			noValidate={noValidate}
			onSubmit={form.handleSubmit(onSubmit, onSubmitError)}
		>
			{children}
		</form>
	</FormProvider>
);

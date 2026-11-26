"use client";

import cx from "clsx-tw";
import React from "react";
import * as z from "zod/mini";

import { mountCenteredSpinner } from "./mountCenteredSpinner.ts";

import {
	type SpinnerRendererProps,
	spinnerVariants,
} from "./spinnerVariants.tsx";

type Registry = Record<string, React.ComponentType<SpinnerRendererProps>>;

const defaults = {
	variants: spinnerVariants as Registry,
	defaultVariant: "arc",
};

const SpinnerContext = React.createContext(defaults);

export const SpinnerProvider = ({
	variants,
	defaultVariant = defaults.defaultVariant,
	children,
}: {
	variants: Registry;
	defaultVariant?: string;
	children: React.ReactNode;
}) => {
	return (
		<SpinnerContext.Provider
			value={{ variants: { ...spinnerVariants, ...variants }, defaultVariant }}
		>
			{children}
		</SpinnerContext.Provider>
	);
};

export const SpinnerPropsSchema = z.object({
	strings: z.optional(
		z.object({
			loading: z.optional(z.string()),
		}),
	),
	className: z.optional(z.string()),
	centered: z.optional(z.boolean()),
	overlay: z.optional(z.boolean()),
	size: z.optional(z.enum(["sm", "md", "lg", "xl"])),
	variant: z.optional(z.string()),
	label: z.optional(z.string()),
});

export type SpinnerProps = z.infer<typeof SpinnerPropsSchema>;

const sizes = { sm: "size-4", md: "size-6", lg: "size-10", xl: "size-16" };

export const Spinner = ({
	strings,
	className,
	centered = true,
	overlay = true,
	size = "md",
	variant,
	label = strings?.loading ?? "Loading",
}: SpinnerProps) => {
	const anchorRef = React.useRef<HTMLSpanElement>(null);

	React.useLayoutEffect(() => {
		const anchor = anchorRef.current;

		if (centered && anchor?.parentElement) {
			const cleanup = mountCenteredSpinner({
				anchor,
				parent: anchor.parentElement,
			});

			return cleanup;
		}
	}, [centered]);

	const registry = React.useContext(SpinnerContext);
	const key = variant ?? registry.defaultVariant;

	const Renderer = Object.hasOwn(registry.variants, key)
		? registry.variants[key]
		: spinnerVariants.arc;

	const icon = <Renderer size={size} className="block size-full" />;

	return (
		<span
			ref={anchorRef}
			data-spinner-centered={centered || undefined}
			title={label}
			className={cx(
				"inline-block shrink-0",
				sizes[size],
				centered && "relative z-1",
				className,
			)}
		>
			{centered ? (
				<span className={cx("spinner-position", overlay && "spinner-overlay")}>
					{icon}
				</span>
			) : (
				icon
			)}
		</span>
	);
};

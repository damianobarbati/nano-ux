"use client";

import cx from "clsx-tw";
import React from "react";

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

export type SpinnerProps = {
	strings?: { loading?: string };
	className?: string;
	centered?: boolean;
	size?: SpinnerRendererProps["size"];
	variant?: string;
	label?: string;
};

const sizes = { sm: "size-4", md: "size-6", lg: "size-10", xl: "size-16" };

export const Spinner = ({
	strings,
	className,
	centered,
	size = "md",
	variant,
	label = strings?.loading ?? "Loading",
}: SpinnerProps) => {
	const registry = React.useContext(SpinnerContext);
	const key = variant ?? registry.defaultVariant;

	const Renderer = Object.hasOwn(registry.variants, key)
		? registry.variants[key]
		: spinnerVariants.arc;

	return (
		<span
			title={label}
			className={cx(
				"inline-block shrink-0",
				sizes[size],
				centered && "mx-auto block",
				className,
			)}
		>
			<Renderer size={size} className="block size-full" />
		</span>
	);
};

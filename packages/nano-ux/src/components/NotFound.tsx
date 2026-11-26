"use client";

import cx from "clsx-tw";
import * as z from "zod/mini";
import { Button } from "./Button.tsx";

export const NotFoundPropsSchema = z.object({
	strings: z.optional(
		z.object({
			title: z.optional(z.string()),
			action: z.optional(z.string()),
		}),
	),
	className: z.optional(z.string()),
	title: z.optional(z.string()),
	href: z.optional(z.string()),
	actionLabel: z.optional(z.string()),
});

export type NotFoundProps = z.infer<typeof NotFoundPropsSchema>;

export const NotFound = ({
	strings,
	className,
	title = strings?.title ?? "Page not found",
	href = "/",
	actionLabel = strings?.action ?? "Back to home",
}: NotFoundProps) => (
	<section
		className={cx(
			"grid justify-items-center gap-6 px-6 py-20 text-center",
			className,
		)}
	>
		<h1>{title}</h1>
		<Button as="a" href={href} variant="outline">
			{actionLabel}
		</Button>
	</section>
);

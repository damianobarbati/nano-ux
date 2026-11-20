"use client";

import cx from "clsx-tw";
import { Button } from "./Button.tsx";

export type NotFoundProps = {
	className?: string;
	title?: string;
	href?: string;
	actionLabel?: string;
};

export const NotFound = ({
	className,
	title = "Page not found",
	href = "/",
	actionLabel = "Back to home",
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

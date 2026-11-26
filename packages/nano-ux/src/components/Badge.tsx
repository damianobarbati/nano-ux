import cx from "clsx-tw";
import type React from "react";
import * as z from "zod/mini";

export const BadgePropsSchema = z.object({
	size: z.optional(z.literal("sm")),
	className: z.optional(z.string()),
});

export type BadgeProps = z.infer<typeof BadgePropsSchema> &
	(React.ComponentPropsWithRef<"span"> & {
		size?: "sm";
	});

export const Badge = ({ className, size, ...props }: BadgeProps) => (
	<span
		className={cx("badge", size === "sm" && "badge-sm", className)}
		{...props}
	/>
);

import cx from "clsx-tw";
import type React from "react";

export type BadgeProps = React.ComponentPropsWithRef<"span"> & {
	size?: "sm";
};

export const Badge = ({ className, size, ...props }: BadgeProps) => (
	<span
		className={cx("badge", size === "sm" && "badge-sm", className)}
		{...props}
	/>
);

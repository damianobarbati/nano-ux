import cx from "clsx-tw";
import * as z from "zod/mini";

import { formatValue, type ValueFormat } from "./formatValue.ts";

export const KPIPropsSchema = z.object({
	className: z.optional(z.string()),
	label: z.string(),
	value: z.union([z.number(), z.string()]),
	formatAs: z.optional(z.custom<ValueFormat>()),
	format: z.optional(z.custom<(value: number) => string>()),
	detail: z.optional(z.string()),
	delta: z.optional(z.nullable(z.number())),
	variant: z.optional(z.enum(["solid", "outline", "ghost"])),
});

export type KPIProps = z.infer<typeof KPIPropsSchema>;

export const KPI = ({
	className,
	label,
	value,
	formatAs,
	format,
	detail,
	delta,
	variant = "solid",
}: KPIProps) => {
	let deltaLabel = "-";

	if (delta != null && delta !== 0) {
		const sign = delta > 0 ? "+" : "";
		const magnitude = Number.isFinite(delta) ? Number(delta.toFixed(1)) : "∞";

		deltaLabel = `${sign}${magnitude}%`;
	}

	return (
		<div
			className={cx(
				"flex flex-col gap-2",
				variant === "solid" && "card",
				variant === "outline" && "card-outline",
				variant === "ghost" && "card-ghost",
				className,
			)}
		>
			<p className="mb-0 font-label">{label}</p>
			<div className="flex items-baseline gap-2">
				<p className="mb-0 text-3xl leading-heading font-heading tracking-heading tabular-nums">
					{formatValue({ value, formatAs, format })}
				</p>
				{delta !== undefined && delta !== null && (
					<p
						className={cx(
							"mb-0 text-base font-medium",
							delta > 0 && "text-success",
							delta < 0 && "text-danger",
						)}
					>
						{deltaLabel}
					</p>
				)}
			</div>
			{detail && <p className="mb-0 text-sm">{detail}</p>}
		</div>
	);
};

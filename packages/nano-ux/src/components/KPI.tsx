import cx from "clsx-tw";
import * as z from "zod/mini";

export const KPIPropsSchema = z.object({
	className: z.optional(z.string()),
	label: z.string(),
	value: z.union([z.number(), z.string()]),
	formatAs: z.optional(
		z.custom<"number" | "percent" | "duration" | Uppercase<string>>(),
	),
	format: z.optional(z.custom<(value: number) => string>()),
	detail: z.optional(z.string()),
	delta: z.optional(z.nullable(z.number())),
	variant: z.optional(z.enum(["solid", "outline", "ghost"])),
});

export type KPIProps = z.infer<typeof KPIPropsSchema>;

const formatValue = ({
	value,
	formatAs,
	format,
}: Pick<KPIProps, "value" | "formatAs" | "format">) => {
	if (typeof value === "string") return value;

	if (format) return format(value);

	if (formatAs === undefined) return value.toLocaleString();

	if (formatAs === "duration") {
		const seconds = Math.round(Math.abs(value));
		const sign = value < 0 && seconds > 0 ? "-" : "";
		return `${sign}${Math.floor(seconds / 60).toLocaleString()}m ${(seconds % 60).toLocaleString()}s`;
	}

	if (formatAs === "percent") {
		return (value / 100).toLocaleString(undefined, {
			style: "percent",
			maximumFractionDigits: Math.abs(value) > 1 ? 0 : 2,
		});
	}

	const notation = value >= 10000 ? "compact" : "standard";

	if (formatAs === "number") {
		return value.toLocaleString(undefined, {
			notation,
			maximumFractionDigits: 2,
		});
	}

	return value.toLocaleString(undefined, {
		style: "currency",
		currency: formatAs,
		currencyDisplay: "narrowSymbol",
		maximumFractionDigits: value < 1 ? 2 : 0,
		notation,
	});
};

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

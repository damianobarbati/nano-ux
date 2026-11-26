export type ValueFormat = "number" | "percent" | "duration" | Uppercase<string>;

export const formatValue = ({
	value,
	formatAs,
	format,
}: {
	value: number | string;
	formatAs?: ValueFormat;
	format?: (value: number) => string;
}) => {
	if (typeof value === "string") return value;

	if (format) return format(value);

	if (formatAs === undefined) return value.toLocaleString();

	if (formatAs === "duration") {
		const seconds = Math.round(Math.abs(value));
		const sign = value < 0 && seconds > 0 ? "-" : "";
		return `${sign}${Math.floor(seconds / 60).toLocaleString()}m ${(seconds % 60).toLocaleString()}s`;
	}

	if (formatAs === "percent") {
		const result = (value / 100).toLocaleString(undefined, {
			style: "percent",
			maximumFractionDigits: Math.abs(value) > 1 ? 0 : 2,
		});

		return result;
	}

	const notation = value >= 10000 ? "compact" : "standard";

	if (formatAs === "number") {
		return value.toLocaleString(undefined, {
			notation,
			maximumFractionDigits: 2,
		});
	}

	const result = value.toLocaleString(undefined, {
		style: "currency",
		currency: formatAs,
		currencyDisplay: "narrowSymbol",
		maximumFractionDigits: value < 1 ? 2 : 0,
		notation,
	});

	return result;
};

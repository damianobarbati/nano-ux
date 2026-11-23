type DateFormat =
	| "YYYY-MM-DD"
	| "YYYY-MM-DDTHH:mm"
	| "YYYY-MM-DDTHH:mm:ss"
	| "ISO";

const formatDate = (value: string, format: DateFormat) => {
	const date = new Date(
		/^\d{4}-\d{2}-\d{2}$/.test(value) ? value + "T00:00:00" : value,
	);

	if (format === "ISO") return date.toISOString();

	if (Number.isNaN(date.getTime())) return "Invalid Date";

	const year = String(date.getFullYear()).padStart(4, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const calendarDate = `${year}-${month}-${day}`;

	if (format === "YYYY-MM-DD") return calendarDate;

	const hour = String(date.getHours()).padStart(2, "0");
	const minute = String(date.getMinutes()).padStart(2, "0");
	const localTime = `${calendarDate}T${hour}:${minute}`;

	if (format === "YYYY-MM-DDTHH:mm") return localTime;

	const second = String(date.getSeconds()).padStart(2, "0");
	return `${localTime}:${second}`;
};

export const keysToDate =
	<T extends object>(keys: ReadonlyArray<keyof T>, format: DateFormat) =>
	(record: T): T => {
		const result = { ...record };

		for (const key of keys) {
			const value = record[key];

			if (typeof value === "string" && value !== "") {
				result[key] = formatDate(value, format) as T[typeof key];
			}
		}

		return result;
	};

import React from "react";

export type TableSort = { id: string; direction: "asc" | "desc" };

export type TableSortingProps = {
	sort?: TableSort;
	defaultSort?: TableSort;
	onSort?: (id: string, nextSort?: TableSort) => void;
	sortableColumns?: string[];
};

export const nextTableSort = (id: string, active?: TableSort) => {
	let next: TableSort | undefined;

	if (active?.id !== id) next = { id, direction: "asc" };
	else if (active.direction === "asc") next = { id, direction: "desc" };

	return next;
};

const collator = new Intl.Collator(undefined, { numeric: true });

const compare = (a: unknown, b: unknown) => {
	if (a === b) return 0;

	if (a == null) return b == null ? 0 : -1;

	if (b == null) return 1;

	if (typeof a === "number" && typeof b === "number") return a - b;

	if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
	return collator.compare(String(a), String(b));
};

export const useTableSorting = <Row>(
	rows: Row[],
	{ sort, defaultSort, onSort }: TableSortingProps,
	getValue: (row: Row, id: string) => unknown,
) => {
	const [localSort, setLocalSort] = React.useState(defaultSort);
	const active = onSort ? sort : localSort;

	const sortedRows = React.useMemo(() => {
		if (onSort || !active) return rows;

		const factor = active.direction === "asc" ? 1 : -1;

		const result = [...rows].sort(
			(a, b) =>
				factor * compare(getValue(a, active.id), getValue(b, active.id)),
		);

		return result;
	}, [active, getValue, onSort, rows]);

	const selectColumn = (id: string) => {
		const next = nextTableSort(id, active);

		if (onSort) onSort(id, next);
		else setLocalSort(next);
	};

	const result = { rows: sortedRows, sort: active, onSort: selectColumn };
	return result;
};

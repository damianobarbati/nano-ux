import cx from "clsx-tw";
import type React from "react";
import { TbArrowDown, TbArrowUp } from "react-icons/tb";

import type { TableSortingProps } from "./useTableSorting.ts";

type TableHeaderCellProps = Pick<
	TableSortingProps,
	"sort" | "onSort" | "sortableColumns"
> & {
	columnId: string;
	className?: string;
	style?: React.CSSProperties;
	children: React.ReactNode;
};

export const TableHeaderCell = ({
	columnId,
	className,
	style,
	children,
	sort,
	onSort,
	sortableColumns,
}: TableHeaderCellProps) => {
	const sorted = sort?.id === columnId;
	const direction = sort?.direction === "asc" ? "ascending" : "descending";

	const SortIcon = direction === "ascending" ? TbArrowUp : TbArrowDown;
	let content;

	if (!sortableColumns || sortableColumns.includes(columnId)) {
		content = (
			<button
				type="button"
				className="inline-flex w-full cursor-pointer items-center gap-2 text-left focus-visible:outline-2 focus-visible:outline-focus"
				onClick={() => onSort?.(columnId)}
			>
				{children}
				{sorted && <SortIcon className="size-4 shrink-0" />}
			</button>
		);
	} else {
		content = children;
	}

	return (
		<th className={cx("table-header-cell", className)} style={style}>
			{content}
		</th>
	);
};

"use client";

import cx from "clsx-tw";
import React from "react";
import * as z from "zod/mini";
import { TableFrame, type TableStrings } from "./TableFrame.tsx";
import { TableHeaderCell } from "./TableHeaderCell.tsx";
import { type TableSortingProps, useTableSorting } from "./useTableSorting.ts";

export type TableColumn<Row> = {
	key: string;
	header: React.ReactNode;
	getSortValue?: (row: Row) => unknown;
	render: (row: Row) => React.ReactNode;
	className?: string;
};

export const TablePropsSchema = z.object({
	className: z.optional(z.string()),
	loading: z.optional(z.boolean()),
	emptyMessage: z.optional(z.string()),
	fillHeight: z.optional(z.boolean()),
});

export type TableProps<Row extends object> = z.infer<typeof TablePropsSchema> &
	(TableSortingProps & {
		columns: TableColumn<Row>[];
		data: Row[];
		getRowKey: (row: Row) => string;
		getRowClassName?: (row: Row) => string | undefined;
		strings?: TableStrings;
		bar?: { getPercentage: (row: Row) => number; className?: string };
		onRowClick?: (row: Row) => void;
		footer?: React.ReactNode;
	});

export const Table = <Row extends object>({
	className,
	fillHeight,
	columns,
	data,
	getRowKey,
	getRowClassName,
	strings,
	emptyMessage,
	loading,
	bar,
	onRowClick,
	footer,
	sort,
	defaultSort,
	onSort,
	sortableColumns,
}: TableProps<Row>) => {
	const getValue = React.useCallback(
		(row: Row, id: string) => {
			const column = columns.find((item) => item.key === id);
			if (column?.getSortValue) return column.getSortValue(row);

			if (id in row) return row[id as keyof Row];
			return column?.render(row);
		},
		[columns],
	);

	const sorting = useTableSorting(
		data,
		{ sort, defaultSort, onSort },
		getValue,
	);

	return (
		<TableFrame
			className={className}
			fillHeight={fillHeight}
			count={data.length}
			strings={strings}
			emptyMessage={emptyMessage}
			loading={loading}
			footer={footer}
		>
			<table className="w-full border-collapse text-left text-sm text-fg">
				<thead className={cx("table-head", loading && "sticky top-0 z-10")}>
					<tr>
						{columns.map((column) => (
							<TableHeaderCell
								key={column.key}
								columnId={column.key}
								className={column.className}
								sort={sorting.sort}
								onSort={sorting.onSort}
								sortableColumns={sortableColumns}
							>
								{column.header}
							</TableHeaderCell>
						))}
					</tr>
				</thead>
				<tbody inert={loading}>
					{sorting.rows.map((row) => {
						const percentage =
							bar && Math.max(1, Math.min(100, bar.getPercentage(row)));

						const progressStyle = percentage
							? ({
									"--table-progress": `${percentage}%`,
								} as React.CSSProperties)
							: undefined;

						return (
							<tr
								key={getRowKey(row)}
								className={cx(
									"table-row",
									onRowClick &&
										"cursor-pointer focus-visible:outline-2 focus-visible:outline-focus",
									percentage && "table-row-progress",
									bar?.className,
									getRowClassName?.(row),
								)}
								onClick={() => {
									if (onRowClick) onRowClick(row);
								}}
								onKeyDown={(event) => {
									if (
										onRowClick &&
										event.target === event.currentTarget &&
										(event.key === "Enter" || event.key === " ")
									) {
										event.preventDefault();
										onRowClick(row);
									}
								}}
								tabIndex={onRowClick ? 0 : undefined}
								style={progressStyle}
							>
								{columns.map((column) => (
									<td
										key={column.key}
										className={cx("table-cell", column.className)}
									>
										{column.render(row)}
									</td>
								))}
							</tr>
						);
					})}
				</tbody>
			</table>
		</TableFrame>
	);
};

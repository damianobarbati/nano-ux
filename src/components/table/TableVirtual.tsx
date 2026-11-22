"use client";

import {
	type ColumnDef,
	columnSizingFeature,
	tableFeatures,
	useTable,
} from "@tanstack/react-table";

import cx from "clsx-tw";
import React from "react";
import { TableFrame, type TableStrings } from "./TableFrame.tsx";
import { TableHeaderCell } from "./TableHeaderCell.tsx";
import { type TableSortingProps, useTableSorting } from "./useTableSorting.ts";

export const tableVirtualFeatures = tableFeatures({ columnSizingFeature });

const rowHeight = 40;

const overscan = 8;

const getSortValue = (row: { getValue: (id: string) => unknown }, id: string) =>
	row.getValue(id);

export type TableVirtualProps<T extends object> = TableSortingProps & {
	className?: string;
	columns: ColumnDef<typeof tableVirtualFeatures, T>[];
	data: T[];
	getRowId?: (row: T) => string;
	onEndReached?: () => void;
	loading?: boolean;
	strings?: TableStrings;
	emptyMessage?: string;
	onRowClick?: (row: T) => void;
	noEllipsisColumns?: string[];
	footer?: React.ReactNode;
};

export const TableVirtual = <T extends object>({
	className,
	columns,
	data,
	getRowId,
	onEndReached,
	loading,
	strings,
	emptyMessage,
	onRowClick,
	sort,
	defaultSort,
	onSort,
	sortableColumns,
	noEllipsisColumns = [],
	footer,
}: TableVirtualProps<T>) => {
	const bodyRef = React.useRef<HTMLTableSectionElement>(null);
	const headerRef = React.useRef<HTMLTableSectionElement>(null);
	const [scrollTop, setScrollTop] = React.useState(0);
	const [viewportHeight, setViewportHeight] = React.useState(0);

	const table = useTable({
		data,
		columns,
		features: tableVirtualFeatures,
		getRowId,
	});

	const sorting = useTableSorting(
		table.getRowModel().rows,
		{ sort, defaultSort, onSort },
		getSortValue,
	);

	const rows = sorting.rows;

	const startIndex = Math.max(
		0,
		Math.min(
			Math.max(0, rows.length - Math.ceil(viewportHeight / rowHeight)),
			Math.floor(scrollTop / rowHeight) - overscan,
		),
	);

	const endIndex = Math.min(
		rows.length,
		startIndex + Math.ceil(viewportHeight / rowHeight) + overscan * 2,
	);

	const visibleRows = rows.slice(startIndex, endIndex);
	const requestedLengthRef = React.useRef<number | null>(null);

	React.useEffect(() => {
		const element = bodyRef.current;
		if (!element) return;

		const observer = new ResizeObserver(() =>
			setViewportHeight(element.clientHeight),
		);

		observer.observe(element);
		setViewportHeight(element.clientHeight);
		return () => observer.disconnect();
	}, []);

	React.useEffect(() => {
		if (!onEndReached) {
			requestedLengthRef.current = null;
			return;
		}

		if (!rows.length || loading) return;

		if (
			endIndex >= rows.length - 5 &&
			requestedLengthRef.current !== rows.length
		) {
			requestedLengthRef.current = rows.length;

			onEndReached();
		}
	}, [endIndex, rows.length, onEndReached, loading]);

	const rowStyle = {
		minWidth: table.getTotalSize(),
		gridTemplateColumns: table
			.getAllLeafColumns()
			.map((column) => `minmax(0, ${column.getSize()}fr)`)
			.join(" "),
	};

	return (
		<TableFrame
			className={className}
			count={rows.length}
			strings={strings}
			emptyMessage={emptyMessage}
			loading={loading}
			footer={footer}
			bodyScroll
		>
			<table className="flex min-h-0 w-full border-collapse flex-col text-left text-sm text-fg">
				<thead
					ref={headerRef}
					className="table-head block shrink-0 [scrollbar-gutter:stable] overflow-hidden"
					onScroll={(event) => {
						const body = bodyRef.current;

						if (body && body.scrollLeft !== event.currentTarget.scrollLeft)
							body.scrollLeft = event.currentTarget.scrollLeft;
					}}
				>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id} className="grid" style={rowStyle}>
							{headerGroup.headers.map((header) => (
								<TableHeaderCell
									key={header.id}
									columnId={header.column.id}
									className="overflow-hidden text-ellipsis"
									style={{ gridColumn: `span ${header.colSpan}` }}
									sort={sorting.sort}
									onSort={sorting.onSort}
									sortableColumns={header.isPlaceholder ? [] : sortableColumns}
								>
									{!header.isPlaceholder && (
										<table.FlexRender header={header} />
									)}
								</TableHeaderCell>
							))}
						</tr>
					))}
				</thead>
				<tbody
					inert={loading}
					ref={bodyRef}
					className="block min-h-0 [scrollbar-gutter:stable] overflow-auto"
					onScroll={(event) => {
						const body = event.currentTarget;
						const header = headerRef.current;

						if (header && header.scrollLeft !== body.scrollLeft)
							header.scrollLeft = body.scrollLeft;

						setScrollTop(body.scrollTop);
					}}
				>
					{startIndex > 0 && (
						<tr
							className="block"
							style={{ height: `${startIndex * rowHeight}px` }}
						>
							<td colSpan={columns.length} />
						</tr>
					)}
					{visibleRows.map((row) => (
						<tr
							key={row.id}
							style={rowStyle}
							className={cx(
								"grid! table-row h-10 items-center",
								onRowClick &&
									"cursor-pointer focus-visible:outline-2 focus-visible:outline-focus",
							)}
							onClick={() => {
								if (onRowClick) onRowClick(row.original);
							}}
							tabIndex={onRowClick ? 0 : undefined}
							onKeyDown={(event) => {
								if (
									onRowClick &&
									event.target === event.currentTarget &&
									(event.key === "Enter" || event.key === " ")
								) {
									event.preventDefault();
									onRowClick(row.original);
								}
							}}
						>
							{row.getAllCells().map((cell) => (
								<td
									key={cell.id}
									className={cx(
										"table-cell whitespace-nowrap",
										!noEllipsisColumns.includes(cell.column.id) &&
											"overflow-hidden text-ellipsis",
									)}
								>
									<table.FlexRender cell={cell} />
								</td>
							))}
						</tr>
					))}
					{endIndex < rows.length && (
						<tr
							className="block"
							style={{ height: `${(rows.length - endIndex) * rowHeight}px` }}
						>
							<td colSpan={columns.length} />
						</tr>
					)}
				</tbody>
			</table>
		</TableFrame>
	);
};

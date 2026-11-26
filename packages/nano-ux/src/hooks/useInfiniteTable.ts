"use client";

import React from "react";
import { unstable_serialize } from "swr";
import type { SWRInfiniteResponse } from "swr/infinite";
import useSWRInfinite from "swr/infinite";
import type { TableVirtualProps } from "../table/TableVirtual.tsx";

import type { TableSort } from "../table/useTableSorting.ts";

export type TablePageRequest = {
	offset: number;
	limit: number;
	sort: [string, "asc" | "desc"][];
};

export type UseInfiniteTableOptions<T extends object> = {
	key: string | ReadonlyArray<unknown>;
	pageSize: number;
	defaultSort?: TableSort;
	fetchPage: (request: TablePageRequest) => Promise<T[]>;
};

export type UseInfiniteTableResult<T extends object> = {
	tableKey: string;
	tableProps: Pick<
		TableVirtualProps<T>,
		"data" | "loading" | "onEndReached" | "sort" | "onSort"
	>;
	hasMore: boolean;
	error: Error | undefined;
	mutate: SWRInfiniteResponse<T[]>["mutate"];
};

export const useInfiniteTable = <T extends object>({
	key,
	pageSize,
	defaultSort,
	fetchPage,
}: UseInfiniteTableOptions<T>): UseInfiniteTableResult<T> => {
	if (!Number.isSafeInteger(pageSize) || pageSize < 1)
		throw new RangeError("pageSize must be a positive integer");

	const [sort, setSort] = React.useState(defaultSort);

	const sorters: TablePageRequest["sort"] = sort
		? [[sort.id, sort.direction]]
		: [];

	const tableKey = unstable_serialize([
		"nano-ux/useInfiniteTable",
		key,
		pageSize,
	]);

	const getKey = (index: number, previous: T[] | null) => {
		if (previous && previous.length < pageSize) return null;
		return [tableKey, index * pageSize, sorters] as const;
	};

	const {
		data: pages,
		error,
		isValidating,
		mutate,
		setSize,
	} = useSWRInfinite<T[], Error, typeof getKey>(
		getKey,
		([, offset, sort]) => fetchPage({ offset, limit: pageSize, sort }),
		{
			revalidateFirstPage: false,
			shouldRetryOnError: false,
			keepPreviousData: false,
		},
	);

	const previousSort = React.useRef(sort);

	React.useEffect(() => {
		if (previousSort.current === sort) return;
		previousSort.current = sort;

		if (pages) void mutate();
	}, [sort, pages, mutate]);

	const data = React.useMemo(() => pages?.flat() ?? [], [pages]);
	const hasMore = pages?.at(-1)?.length === pageSize;

	const onEndReached = async () => {
		if (!pages || !hasMore || isValidating || error) return;
		await setSize(pages.length + 1);
	};

	const result = {
		tableKey,
		tableProps: {
			sort,
			onSort: (_id: string, next?: TableSort) => setSort(next),
			data,
			loading: isValidating,
			onEndReached: hasMore && !error ? onEndReached : undefined,
		},
		hasMore,
		error,
		mutate,
	};

	return result;
};

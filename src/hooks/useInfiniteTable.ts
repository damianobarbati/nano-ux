"use client";

import React from "react";
import { unstable_serialize } from "swr";
import type { SWRInfiniteResponse } from "swr/infinite";
import useSWRInfinite from "swr/infinite";
import type { TableVirtualProps } from "../components/table/TableVirtual.tsx";

type PageRequest = { offset: number; limit: number };

export type UseInfiniteTableOptions<T extends object> = {
	key: string | ReadonlyArray<unknown>;
	pageSize: number;
	fetchPage: (request: PageRequest) => Promise<T[]>;
};

export type UseInfiniteTableResult<T extends object> = {
	tableKey: string;
	tableProps: Pick<TableVirtualProps<T>, "data" | "loading" | "onEndReached">;
	hasMore: boolean;
	error: Error | undefined;
	mutate: SWRInfiniteResponse<T[]>["mutate"];
};

export const useInfiniteTable = <T extends object>({
	key,
	pageSize,
	fetchPage,
}: UseInfiniteTableOptions<T>): UseInfiniteTableResult<T> => {
	if (!Number.isSafeInteger(pageSize) || pageSize < 1)
		throw new RangeError("pageSize must be a positive integer");

	const tableKey = unstable_serialize([
		"nano-ui/useInfiniteTable",
		key,
		pageSize,
	]);

	const getKey = (index: number, previous: T[] | null) => {
		if (previous && previous.length < pageSize) return null;
		return [tableKey, index * pageSize] as const;
	};

	const {
		data: pages,
		error,
		isValidating,
		mutate,
		setSize,
	} = useSWRInfinite<T[], Error, typeof getKey>(
		getKey,
		([, offset]) => fetchPage({ offset, limit: pageSize }),
		{
			revalidateFirstPage: false,
			shouldRetryOnError: false,
			keepPreviousData: false,
		},
	);

	const data = React.useMemo(() => pages?.flat() ?? [], [pages]);
	const hasMore = pages?.at(-1)?.length === pageSize;

	const onEndReached = async () => {
		if (!pages || !hasMore || isValidating || error) return;
		await setSize(pages.length + 1);
	};

	return {
		tableKey,
		tableProps: {
			data,
			loading: isValidating,
			onEndReached: hasMore && !error ? onEndReached : undefined,
		},
		hasMore,
		error,
		mutate,
	};
};

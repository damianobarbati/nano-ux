"use client";

import React from "react";

export type SelectOption = {
	value: string;
	label: string;
	content?: React.ReactNode;
	disabled?: boolean;
};

export type SelectOptionsFetcher = (
	signal: AbortSignal,
) => Promise<SelectOption[]>;

type Result = {
	fetcher: SelectOptionsFetcher;
	options?: SelectOption[];
	loading?: boolean;
	failed?: boolean;
};

export function useSelectOptions(
	fetcher?: SelectOptionsFetcher,
	loadError = "Could not load options.",
) {
	const [result, setResult] = React.useState<Result>();

	React.useEffect(() => {
		if (!fetcher) {
			setResult(undefined);
			return;
		}

		const controller = new AbortController();

		setResult((previous) => ({
			fetcher,
			options: previous?.options,
			loading: true,
		}));

		async function load(request: SelectOptionsFetcher) {
			try {
				const options = await request(controller.signal);

				if (!controller.signal.aborted)
					setResult({ fetcher: request, options });
			} catch {
				if (!controller.signal.aborted)
					setResult({
						fetcher: request,
						options: [],
						failed: true,
					});
			}
		}

		void load(fetcher);
		return () => controller.abort();
	}, [fetcher]);

	const result2 = {
		options: result?.options,
		loading: !!fetcher && (result?.fetcher !== fetcher || !!result.loading),
		error:
			fetcher && result?.fetcher === fetcher && result.failed
				? loadError
				: undefined,
	};

	return result2;
}

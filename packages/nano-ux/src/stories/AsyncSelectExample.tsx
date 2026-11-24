import React from "react";
import type { SelectOptionsFetcher } from "../hooks/useSelectOptions.ts";

function createFetcher(): SelectOptionsFetcher {
	return async (signal) => {
		await new Promise<void>((resolve, reject) => {
			signal.throwIfAborted();

			const timer = window.setTimeout(resolve, 2000);

			signal.addEventListener(
				"abort",
				() => {
					window.clearTimeout(timer);
					reject(signal.reason);
				},
				{ once: true },
			);
		});

		return ["example.com", "website.test", "acme.dev"].map((value) => ({
			value,
			label: value,
		}));
	};
}

export const AsyncSelectExample = ({
	children,
}: {
	children: (fetcher: SelectOptionsFetcher) => React.ReactNode;
}) => {
	const [fetcher, setFetcher] = React.useState(createFetcher);
	return (
		<div className="grid gap-2">
			{children(fetcher)}
			<button
				className="anchor justify-self-start text-sm"
				type="button"
				onClick={() => setFetcher(() => createFetcher())}
			>
				Reload options
			</button>
		</div>
	);
};

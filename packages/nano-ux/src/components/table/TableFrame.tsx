"use client";

import cx from "clsx-tw";
import React from "react";
import { Spinner } from "../Spinner.tsx";

export type TableStrings = {
	empty?: string;
	loading?: string;
	resultCount?: (count: number) => string;
};

type TableFrameProps = {
	strings?: TableStrings;
	className?: string;
	fillHeight?: boolean;
	children: React.ReactNode;
	count: number;
	emptyMessage?: string;
	loading?: boolean;
	footer?: React.ReactNode;
	bodyScroll?: boolean;
};

export const TableFrame = ({
	className,
	fillHeight = false,
	children,
	count,
	strings,
	emptyMessage = strings?.empty ?? "No data found.",
	loading,
	footer,
	bodyScroll,
}: TableFrameProps) => {
	const frameRef = React.useRef<HTMLDivElement>(null);

	React.useLayoutEffect(() => {
		if (!loading) return;

		const frame = frameRef.current;
		const header = frame?.querySelector("thead");
		if (!frame || !header) return;

		const updateHeaderHeight = () => {
			frame.style.setProperty(
				"--table-header-height",
				`${header.getBoundingClientRect().height}px`,
			);
		};

		updateHeaderHeight();

		const observer = new ResizeObserver(updateHeaderHeight);

		observer.observe(header);
		return () => observer.disconnect();
	}, [loading]);

	return (
		<div
			className={cx(
				"flex min-h-0 min-w-0 flex-col",
				fillHeight && "flex-1",
				className,
			)}
		>
			<div
				ref={frameRef}
				className={cx(
					"table-shell relative flex min-h-0 flex-col",
					fillHeight && "flex-1",
					loading &&
						!count &&
						"min-h-[calc(var(--table-header-height,0px)+4.5rem)] grow",
				)}
			>
				<div
					className={cx(
						"table-scroll min-h-0",
						fillHeight && "flex-1",
						bodyScroll && "flex flex-col !overflow-hidden",
					)}
				>
					{children}
					{!count && !loading && (
						<p className="p-8 text-center text-fg-muted">{emptyMessage}</p>
					)}
				</div>
				{loading && (
					<div className="absolute inset-x-0 top-[var(--table-header-height)] bottom-0 z-20 grid place-items-center text-fg">
						<Spinner label={strings?.loading} size="lg" />
					</div>
				)}
			</div>
			<div className="table-footer">
				{footer ??
					((!loading || count > 0) && (
						<span>
							{strings?.resultCount?.(count) ??
								`${count} ${count === 1 ? "result" : "results"}`}
						</span>
					))}
			</div>
		</div>
	);
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { createColumnHelper } from "@tanstack/react-table";
import React from "react";
import { SWRConfig } from "swr";
import { Button } from "../components/Button.tsx";

import {
	TableVirtual,
	type tableVirtualFeatures,
} from "../components/table/TableVirtual.tsx";

import { useInfiniteTable } from "../hooks/useInfiniteTable.ts";

type Website = { domain: string };
const column = createColumnHelper<typeof tableVirtualFeatures, Website>();

const columns = column.columns([
	column.accessor("domain", { header: "Website" }),
]);

type PageRequest = { offset: number; limit: number; group: string };

const countWebsites = ({ group }: Pick<PageRequest, "group">) =>
	group === "All" ? 64 : 61;

const loadWebsites = async ({ offset, limit, group }: PageRequest) => {
	await new Promise<void>((resolve) => window.setTimeout(resolve, 100));

	const count = countWebsites({ group });
	return Array.from(
		{ length: Math.min(limit, Math.max(0, count - offset)) },
		(_, index) => ({
			domain: `${group.toLowerCase()}-${offset + index + 1}.example.com`,
		}),
	);
};

const InfiniteWebsites = () => {
	const [group, setGroup] = React.useState("All");

	const { tableKey, tableProps, error, mutate } = useInfiniteTable({
		key: ["websites", group],
		pageSize: 8,
		fetchPage: (page) => loadWebsites({ ...page, group }),
	});

	return (
		<div className="grid w-[min(40rem,90vw)] gap-3">
			<label>
				Websites{" "}
				<select
					value={group}
					onChange={(event) => setGroup(event.target.value)}
				>
					<option>All</option>
					<option>Active</option>
				</select>
			</label>
			<TableVirtual
				key={tableKey}
				{...tableProps}
				columns={columns}
				totalCount={countWebsites({ group })}
				emptyMessage="No websites found."
				className="[&_tbody]:max-h-90"
				getRowId={(row) => row.domain}
			/>
			{!!error && (
				<div>
					<span role="alert">{error.message}</span>{" "}
					<Button onClick={() => mutate()}>Retry</Button>
				</div>
			)}
		</div>
	);
};

const meta = {
	title: "Components / TableVirtual",
	component: InfiniteWebsites,
	decorators: [
		(Story) => (
			<SWRConfig value={{ provider: () => new Map() }}>
				<Story />
			</SWRConfig>
		),
	],
} satisfies Meta<typeof InfiniteWebsites>;

export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "TableVirtual" };

import type { Meta, StoryObj } from "@storybook/react-vite";
import { createColumnHelper } from "@tanstack/react-table";
import React from "react";
import { expect, fireEvent, waitFor, within } from "storybook/test";
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

const loadWebsites = async ({ offset, limit, group }: PageRequest) => {
	await new Promise<void>((resolve) => window.setTimeout(resolve, 100));

	const count = group === "All" ? 64 : 61;
	return Array.from(
		{ length: Math.min(limit, Math.max(0, count - offset)) },
		(_, index) => ({
			domain: `${group.toLowerCase()}-${offset + index + 1}.example.com`,
		}),
	);
};

const InfiniteWebsites = ({
	fetchPage = loadWebsites,
}: {
	fetchPage?: typeof loadWebsites;
}) => {
	const [group, setGroup] = React.useState("All");

	const { tableKey, tableProps, error, mutate } = useInfiniteTable({
		key: ["websites", group],
		pageSize: 8,
		fetchPage: (page) => fetchPage({ ...page, group }),
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
	title: "Components / TableVirtual / Infinite scroll",
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
export const Default: Story = {};

export const RetryAndScroll: Story = {
	loaders: [
		() => {
			const requests: PageRequest[] = [];

			const fetchPage = async (request: PageRequest) => {
				requests.push(request);

				if (requests.length === 2) throw new Error("Could not load websites.");
				return await loadWebsites(request);
			};

			return { requests, fetchPage };
		},
	],
	render: (_, { loaded }) => <InfiniteWebsites fetchPage={loaded.fetchPage} />,
	play: async ({ canvasElement, loaded }) => {
		const canvas = within(canvasElement);
		const requests: PageRequest[] = loaded.requests;

		const offsets = (group: string) =>
			requests
				.filter((page) => page.group === group)
				.map((page) => page.offset);

		const scrollToEnd = () => {
			const body = canvasElement.querySelector("tbody");
			if (!body) throw new Error("Missing table body");

			body.scrollTop = body.scrollHeight;
			fireEvent.scroll(body);
		};

		await canvas.findByRole("alert");
		await expect(canvas.getByText("all-1.example.com")).toBeVisible();
		await expect(offsets("All")).toEqual([0, 8]);
		fireEvent.click(canvas.getByRole("button", { name: "Retry" }));
		await canvas.findByText("32 results");

		const allRowsBody = canvasElement.querySelector("tbody");

		fireEvent.change(canvas.getByRole("combobox"), {
			target: { value: "Active" },
		});

		await canvas.findByText("active-1.example.com");
		await canvas.findByText("32 results");
		await expect(canvasElement.querySelector("tbody")).not.toEqual(allRowsBody);
		await expect(canvasElement.querySelector("tbody")?.scrollTop).toEqual(0);

		for (const count of [40, 48, 56, 61]) {
			scrollToEnd();
			await canvas.findByText(`${count} results`);
		}

		scrollToEnd();
		await canvas.findByText("active-61.example.com");
		await expect(offsets("Active")).toEqual([0, 8, 16, 24, 32, 40, 48, 56]);

		fireEvent.change(canvas.getByRole("combobox"), {
			target: { value: "All" },
		});

		await canvas.findByText("32 results");

		for (const count of [40, 48, 56, 64]) {
			scrollToEnd();
			scrollToEnd();
			await canvas.findByText(`${count} results`);
		}

		scrollToEnd();

		await waitFor(() =>
			expect(offsets("All")).toEqual([0, 8, 0, 8, 16, 24, 32, 40, 48, 56, 64]),
		);

		await canvas.findByText("all-64.example.com");
	},
};

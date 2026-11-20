import { createColumnHelper } from "@tanstack/react-table";

import {
	TableVirtual,
	type tableVirtualFeatures,
} from "../components/table/TableVirtual.tsx";

import {
	DeleteWebsiteButton,
	TableStoryLayout,
	type Website,
} from "./TableStoryLayout.tsx";

const column = createColumnHelper<typeof tableVirtualFeatures, Website>();

const columns = column.columns([
	column.accessor("domain", { header: "Website", size: 300 }),
	column.accessor("visitors", { header: "Visitors", size: 140 }),
	column.display({
		id: "delete",
		header: () => null,
		size: 64,
		cell: ({ row }) => <DeleteWebsiteButton domain={row.original.domain} />,
	}),
]);

export default { title: "Components / TableVirtual", component: TableVirtual };

export const Variants = {
	name: "TableVirtual",
	render: () => (
		<TableStoryLayout
			count={1000}
			renderTable={(props) => (
				<TableVirtual
					{...props}
					columns={columns}
					sortableColumns={["domain", "visitors"]}
					getRowId={(row) => row.domain}
				/>
			)}
		/>
	),
};

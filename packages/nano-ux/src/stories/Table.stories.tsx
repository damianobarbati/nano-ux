import { Table } from "../components/table/Table.tsx";

import {
	DeleteWebsiteButton,
	TableStoryLayout,
	type Website,
} from "./TableStoryLayout.tsx";

const columns = [
	{
		key: "domain",
		className: "w-[300px]",
		header: "Website",
		render: (row: Website) => row.domain,
	},
	{
		key: "visitors",
		className: "w-[140px]",
		header: "Visitors",
		render: (row: Website) => row.visitors.toLocaleString("en"),
	},
	{
		key: "delete",
		header: null,
		className: "w-16",
		render: (row: Website) => <DeleteWebsiteButton domain={row.domain} />,
	},
];

export default { title: "Components / Table", component: Table };

export const Variants = {
	name: "Table",
	render: () => (
		<TableStoryLayout
			count={100}
			renderTable={(props) => (
				<Table
					{...props}
					columns={columns}
					sortableColumns={["domain", "visitors"]}
					getRowKey={(row) => row.domain}
					bar={{ getPercentage: (row) => row.visitors / 10 }}
				/>
			)}
		/>
	),
};

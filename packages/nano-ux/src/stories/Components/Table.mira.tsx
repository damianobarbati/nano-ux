import * as z from "zod/mini";
import { Table, TablePropsSchema } from "../../table/Table.tsx";

import {
	DeleteWebsiteButton,
	TableStoryLayout,
	type Website,
} from "../TableStoryLayout.tsx";

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

export const Preview = () => (
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
);

export const schema = z.pick(TablePropsSchema, {
	loading: true,
	fillHeight: true,
	emptyMessage: true,
});

export const Playground = (props: z.infer<typeof schema>) => (
	<Table
		columns={columns}
		data={[{ domain: "example.com", visitors: 12 }]}
		getRowKey={(row) => row.domain}
		{...props}
	/>
);

export const section = "Components";

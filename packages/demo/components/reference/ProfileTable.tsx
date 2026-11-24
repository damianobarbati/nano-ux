import { Table, type TableColumn } from "nano-ux";

type Profile = { id: string; name: string; visits: number };

const data: Profile[] = [
	{ id: "ada", name: "Ada", visits: 12 },
	{ id: "lin", name: "Lin", visits: 4 },
];

const columns: TableColumn<Profile>[] = [
	{ key: "name", header: "Name", render: (row) => row.name },
	{ key: "visits", header: "Visits", render: (row) => row.visits },
];

type ProfileTableProps = { className?: string };

export const ProfileTable = ({ className }: ProfileTableProps) => (
	<Table
		className={className}
		data={data}
		columns={columns}
		getRowKey={(row) => row.id}
		sortableColumns={["name", "visits"]}
		defaultSort={{ id: "name", direction: "asc" }}
	/>
);

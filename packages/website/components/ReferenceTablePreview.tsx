import cx from "clsx-tw";

import {
	createColumnHelper,
	TableVirtual,
	type tableVirtualFeatures,
	useInfiniteTable,
} from "nano-ux";

import React from "react";
import { listProfiles, type Profile, profiles } from "../data.ts";

type ReferenceTablePreviewProps = { className?: string };

const column = createColumnHelper<typeof tableVirtualFeatures, Profile>();

const columns = column.columns([
	column.accessor("name", { header: "Name" }),
	column.accessor("email", { header: "Email" }),
]);

export const ReferenceTablePreview = ({
	className,
}: ReferenceTablePreviewProps) => {
	const { tableKey, tableProps } = useInfiniteTable<Profile>({
		key: "reference/profiles",
		pageSize: 50,
		fetchPage: async (request) => {
			const page = listProfiles({ rows: profiles, ...request });
			return page;
		},
	});

	return (
		<TableVirtual
			key={tableKey}
			className={cx("h-96", className)}
			columns={columns}
			totalCount={profiles.length}
			emptyMessage="No profiles found."
			{...tableProps}
		/>
	);
};

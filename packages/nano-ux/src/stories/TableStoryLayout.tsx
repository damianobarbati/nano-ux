import type React from "react";
import { Button } from "../components/Button.tsx";
import { Tooltip } from "../components/Tooltip.tsx";
import { ITrash } from "../icons.tsx";

export type Website = { domain: string; visitors: number };

export const DeleteWebsiteButton = ({ domain }: Pick<Website, "domain">) => (
	<Tooltip content="Delete website">
		<Button
			aria-label={`Delete ${domain}`}
			className="size-8 p-0"
			color="danger"
			size="sm"
			variant="ghost"
		>
			<ITrash aria-hidden="true" className="size-4" />
		</Button>
	</Tooltip>
);

const websites = Array.from({ length: 1000 }, (_, index) => ({
	domain: `website-${String(index + 1).padStart(4, "0")}.example.com`,
	visitors: 1000 - index,
}));

// One header and ten rows, each 2.5rem high.
const defaultTableClassName =
	"[&_.table-scroll]:max-h-[27.5rem] [&_thead]:sticky [&_thead]:top-0 [&_tr]:h-10 [&_td:last-child]:text-right [&_.table-cell]:py-0 [&_.table-header-cell]:py-0";

type ExampleProps = {
	className?: string;
	data: Website[];
	emptyMessage: string;
	loading?: boolean;
	defaultSort?: { id: string; direction: "asc" | "desc" };
};

type TableStoryLayoutProps = {
	count: number;
	renderTable: (props: ExampleProps) => React.ReactNode;
};

export const TableStoryLayout = ({
	count,
	renderTable,
}: TableStoryLayoutProps) => {
	const empty = { data: [], emptyMessage: "No websites found." };

	return (
		<div className="grid w-[min(64rem,calc(100vw-2rem))] gap-8 [&_section]:min-w-0 [&_table]:table-fixed [&_table:not(.flex)]:min-w-[440px]">
			<section>
				<h2>Default</h2>
				{renderTable({
					...empty,
					data: websites.slice(0, count),
					defaultSort: { id: "visitors", direction: "desc" },
					className: defaultTableClassName,
				})}
			</section>
			<section>
				<h2>Loading</h2>
				{renderTable({ ...empty, className: "h-64", loading: true })}
			</section>
			<section>
				<h2>Empty</h2>
				{renderTable(empty)}
			</section>
		</div>
	);
};

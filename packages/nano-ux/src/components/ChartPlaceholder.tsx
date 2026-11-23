import cx from "clsx-tw";
import { TbDatabaseOff } from "react-icons/tb";
import { Spinner } from "./Spinner.tsx";

export type ChartStrings = { loading?: string; noData?: string };

export const ChartPlaceholder = ({
	strings,
	loading,
	label,
	className,
}: {
	strings?: ChartStrings;
	loading: boolean;
	label: string;
	className?: string;
}) => {
	const description = [label, strings?.loading ?? "Loading"]
		.filter(Boolean)
		.join(" · ");

	let content;

	if (loading) {
		content = <Spinner size="lg" label={description} />;
	} else {
		content = (
			<span className="flex flex-col items-center gap-2 text-sm">
				<TbDatabaseOff className="size-6" />
				{strings?.noData ?? "No data"}
			</span>
		);
	}

	return (
		<div
			className={cx("grid h-56 place-items-center text-fg-muted", className)}
		>
			{content}
		</div>
	);
};

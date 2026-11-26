import { Button } from "nano-ux";
import React from "react";

type SaveButtonProps = { className?: string };

export const SaveButton = ({ className }: SaveButtonProps) => {
	const [loading, setLoading] = React.useState(false);
	const [saved, setSaved] = React.useState(false);

	const save = async () => {
		setLoading(true);

		const { promise, resolve } = Promise.withResolvers<void>();

		window.setTimeout(resolve, 500);
		await promise;
		setSaved(true);
		setLoading(false);
	};

	return (
		<Button
			className={className}
			type="button"
			variant="outline"
			loading={loading}
			disabled={saved}
			onClick={save}
		>
			{saved ? "Saved" : "Save"}
		</Button>
	);
};

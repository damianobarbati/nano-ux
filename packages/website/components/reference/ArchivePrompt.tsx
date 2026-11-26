import { Button, Dialog } from "nano-ux";
import React from "react";

type ArchivePromptProps = { className?: string };

export const ArchivePrompt = ({ className }: ArchivePromptProps) => {
	const [open, setOpen] = React.useState(false);
	const [busy, setBusy] = React.useState(false);
	const [archived, setArchived] = React.useState(false);

	const confirm = async () => {
		setBusy(true);

		const { promise, resolve } = Promise.withResolvers<void>();

		window.setTimeout(resolve, 300);
		await promise;
		setArchived(true);
		setOpen(false);
		setBusy(false);
	};

	return (
		<div className={className}>
			<Button type="button" disabled={archived} onClick={() => setOpen(true)}>
				{archived ? "Archived" : "Archive"}
			</Button>
			<Dialog
				open={open}
				title="Archive profile?"
				confirmLabel="Archive"
				closeOnBackdrop
				busy={busy}
				onConfirm={confirm}
				onClose={() => setOpen(false)}
			>
				The profile will move to the archive.
			</Dialog>
		</div>
	);
};

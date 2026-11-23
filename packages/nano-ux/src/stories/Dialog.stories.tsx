import React from "react";
import { Button } from "../components/Button.tsx";
import { Dialog } from "../components/Dialog.tsx";
import { Toast } from "../components/Toast.tsx";

export default { title: "Components / Dialog", component: Dialog };

const ConfirmationExample = () => {
	const [open, setOpen] = React.useState(false);
	const [message, setMessage] = React.useState("");
	return (
		<>
			<Button onClick={() => setOpen(true)}>Delete item</Button>
			<Dialog
				open={open}
				title="Delete item?"
				confirmLabel="Delete"
				onClose={() => setOpen(false)}
				onConfirm={() => {
					setOpen(false);
					setMessage("Item deleted.");
				}}
			>
				This action cannot be undone.
			</Dialog>
			<Toast message={message} onClose={() => setMessage("")} />
		</>
	);
};

const BusyExample = () => {
	const [open, setOpen] = React.useState(false);

	React.useEffect(() => {
		if (!open) return;

		const timeout = window.setTimeout(() => setOpen(false), 2000);
		return () => window.clearTimeout(timeout);
	}, [open]);

	return (
		<>
			<Button onClick={() => setOpen(true)}>Save changes</Button>
			<Dialog
				open={open}
				busy
				title="Saving changes"
				onClose={() => setOpen(false)}
				onConfirm={() => undefined}
			>
				Please wait.
			</Dialog>
		</>
	);
};

type LessonDetailsOptions = Pick<
	React.ComponentProps<typeof Dialog>,
	"fullscreen" | "closeOnBackdrop"
>;

const LessonDetailsExample = (options: LessonDetailsOptions) => {
	const [open, setOpen] = React.useState(false);
	return (
		<>
			<Button onClick={() => setOpen(true)}>Lesson details</Button>
			<Dialog
				{...options}
				title="Lesson details"
				closeLabel="Chiudi"
				open={open}
				onClose={() => setOpen(false)}
			>
				<ol>
					{Array.from({ length: 80 }, (_, index) => (
						<li key={index}>Participant {index + 1}</li>
					))}
				</ol>
			</Dialog>
		</>
	);
};

export const Variants = {
	name: "Dialog",
	args: { fullscreen: true, closeOnBackdrop: false },
	render: (args: LessonDetailsOptions) => (
		<div className="grid gap-8">
			<section>
				<h2>Confirmation</h2>
				<ConfirmationExample />
			</section>
			<section>
				<h2>Busy</h2>
				<BusyExample />
			</section>
			<section>
				<h2>Lesson details</h2>
				<LessonDetailsExample {...args} />
			</section>
		</div>
	),
};

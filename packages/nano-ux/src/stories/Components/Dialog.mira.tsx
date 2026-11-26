import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod/mini";
import { Button } from "../../components/Button.tsx";
import { Dialog, DialogPropsSchema } from "../../components/Dialog.tsx";
import { Toast } from "../../components/Toast.tsx";
import { Form } from "../../controls/Form.tsx";
import { Input } from "../../controls/Input.tsx";

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

const EditNameExample = () => {
	const [open, setOpen] = React.useState(false);
	const form = useForm({ defaultValues: { name: "", reference: "" } });
	return (
		<>
			<Button onClick={() => setOpen(true)}>Edit name</Button>
			<Dialog open={open} title="Edit name" onClose={() => setOpen(false)}>
				<Form
					className="grid gap-3"
					form={form}
					onSubmit={() => setOpen(false)}
				>
					<input type="hidden" name="id" value="1" />
					<Input label="Reference" name="reference" disabled />
					<Input label="Name" name="name" />
					<Button type="submit">Save</Button>
				</Form>
			</Dialog>
		</>
	);
};

const exampleProps = { fullscreen: true, closeOnBackdrop: false };

const Gallery = (args: LessonDetailsOptions) => (
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
);

export const Preview = () => <Gallery {...exampleProps} />;

export const WithForm = () => <EditNameExample />;

export const schema = z.pick(DialogPropsSchema, {
	fullscreen: true,
	closeOnBackdrop: true,
});

export const Playground = (props: z.infer<typeof schema>) => (
	<LessonDetailsExample {...props} />
);

export const section = "Components";

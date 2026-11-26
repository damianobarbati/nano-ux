import React from "react";
import * as z from "zod/mini";
import { Button } from "../../components/Button.tsx";
import { Toast, ToastPropsSchema } from "../../components/Toast.tsx";

const Example = () => {
	const [trigger, setTrigger] = React.useState<HTMLButtonElement>();
	return (
		<>
			<Button onClick={(event) => setTrigger(event.currentTarget)}>
				Show toast
			</Button>
			{trigger && (
				<Toast
					message="Changes saved successfully."
					onClose={() => {
						trigger.focus();
						setTrigger(undefined);
					}}
				/>
			)}
		</>
	);
};

export const Preview = Example;

export const schema = z.pick(ToastPropsSchema, { message: true, tone: true });
export const defaults = { message: "Changes saved" };

export const Playground = (props: z.infer<typeof schema>) => (
	<Toast className="static" {...props} />
);

export const section = "Components";

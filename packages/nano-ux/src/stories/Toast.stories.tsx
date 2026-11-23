import React from "react";
import { Button } from "../components/Button.tsx";
import { Toast } from "../components/Toast.tsx";

export default { title: "Components / Toast", component: Toast };

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

export const Success = {
	name: "Toast",
	render: Example,
};

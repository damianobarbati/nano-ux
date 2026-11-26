import { Button, Toast } from "nano-ux";
import React from "react";

type ReferenceToastPreviewProps = { className?: string };

export const ReferenceToastPreview = ({
	className,
}: ReferenceToastPreviewProps) => {
	const [trigger, setTrigger] = React.useState<HTMLButtonElement>();

	return (
		<div className={className}>
			<Button
				as="button"
				type="button"
				onClick={(event) => setTrigger(event.currentTarget)}
			>
				Show toast
			</Button>
			{!!trigger && (
				<Toast
					message="Saved"
					duration={5000}
					onClose={(reason) => {
						if (reason === "dismiss") trigger.focus();

						setTrigger(undefined);
					}}
				/>
			)}
		</div>
	);
};

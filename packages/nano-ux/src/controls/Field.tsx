import cx from "clsx-tw";
import type React from "react";
import type { FormFieldProps } from "../hooks/useFormField.ts";
import { FieldMessage } from "./FieldMessage.tsx";

export type FieldProps = Pick<
	FormFieldProps,
	"label" | "helpText" | "error"
> & {
	className?: string;
	id: string;
	children: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
};

export const Field = ({
	className,
	id,
	label,
	helpText,
	error,
	children,
}: FieldProps) => {
	return (
		<div className={cx("control", className)}>
			{label && (
				<label className="control-label" htmlFor={id}>
					{label}
				</label>
			)}
			{children}
			<FieldMessage error={error} helpText={helpText} />
		</div>
	);
};

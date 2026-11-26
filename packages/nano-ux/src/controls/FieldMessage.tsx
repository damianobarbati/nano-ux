import type { FormFieldProps } from "../hooks/useFormField.ts";

type FieldMessageProps = Pick<FormFieldProps, "error" | "helpText">;

export const FieldMessage = ({ error, helpText }: FieldMessageProps) => {
	if (!error && !helpText) return null;

	return (
		<span className={error ? "control-error" : "control-help"}>
			{error || helpText}
		</span>
	);
};

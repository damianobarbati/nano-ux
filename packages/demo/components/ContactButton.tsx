import cx from "clsx-tw";
import { ISend } from "nano-ux";

type ContactButtonProps = { className?: string };

export const ContactButton = ({ className }: ContactButtonProps) => {
	return (
		<button
			className={cx("inline-flex items-center gap-2 text-sm", className)}
			type="button"
			onClick={(event) => {
				if (!event.isTrusted) return;

				window.location.href = window.atob(
					"bWFpbHRvOmRhbWlhbm8uYmFyYmF0aUBnbWFpbC5jb20=",
				);
			}}
		>
			<ISend className="size-4" aria-hidden="true" />
			<span>Contact me</span>
		</button>
	);
};

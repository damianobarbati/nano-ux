import cx from "clsx-tw";
import { ThemeSelector } from "nano-ux";

type HeaderProps = { className?: string };

export const Header = ({ className }: HeaderProps) => (
	<header className={cx("flex items-center gap-3", className)}>
		<ThemeSelector
			className="static shrink-0"
			defaultTheme="system"
			tooltipPlacement="bottom"
		/>
		<p className="m-0 text-sm text-fg-muted">
			Press <kbd>Shift + T</kbd> while focused to toggle the theme.
		</p>
	</header>
);

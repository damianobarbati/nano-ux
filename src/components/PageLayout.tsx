import cx from "clsx-tw";
import React from "react";

export type PageLayoutProps = {
	className?: string;
	contentClassName?: string;
	children: React.ReactNode;
};

export const PageLayout = ({
	className,
	contentClassName,
	children,
}: PageLayoutProps) => {
	React.useEffect(() => {
		const section = document.getElementById(window.location.hash.slice(1));

		if (section) {
			section.scrollIntoView();
			return;
		}

		window.scrollTo(0, 0);
	}, []);

	return (
		<div className={cx("flex-1 bg-bg text-fg", className)}>
			<main
				className={cx(
					"typo-lg mx-auto max-w-4xl px-6 py-12 lg:px-10 lg:py-20",
					contentClassName,
				)}
			>
				{children}
			</main>
		</div>
	);
};

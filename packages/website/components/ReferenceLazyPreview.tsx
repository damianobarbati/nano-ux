import cx from "clsx-tw";
import { Spinner, useInViewOnce } from "nano-ux";
import React from "react";

type ReferenceLazyPreviewProps = {
	className?: string;
	children: React.ReactNode;
};

export const ReferenceLazyPreview = ({
	className,
	children,
}: ReferenceLazyPreviewProps) => {
	const { ref, hasEnteredView } = useInViewOnce();

	return (
		<div className={cx("relative min-w-0", className)} ref={ref}>
			{hasEnteredView && (
				<React.Suspense fallback={<Spinner centered label="Loading preview" />}>
					{children}
				</React.Suspense>
			)}
		</div>
	);
};

"use client";

import React from "react";

export const useInViewOnce = () => {
	const [hasEnteredView, setHasEnteredView] = React.useState(false);

	const ref = React.useCallback(
		(element: Element | null) => {
			if (!element || hasEnteredView) return;

			if (!("IntersectionObserver" in window)) {
				setHasEnteredView(true);
				return;
			}

			const observer = new IntersectionObserver(([entry]) => {
				if (!entry.isIntersecting) return;

				observer.disconnect();
				setHasEnteredView(true);
			});

			observer.observe(element);
			return () => observer.disconnect();
		},
		[hasEnteredView],
	);

	return { ref, hasEnteredView };
};

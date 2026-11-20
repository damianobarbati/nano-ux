"use client";

import React from "react";

export const useAnchorScroll = (): void => {
	React.useEffect(() => {
		const section = document.getElementById(window.location.hash.slice(1));

		if (section) {
			section.scrollIntoView();
			return;
		}

		window.scrollTo(0, 0);
	}, []);
};

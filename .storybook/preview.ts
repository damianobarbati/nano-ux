import type { Preview } from "@storybook/react-vite";
import React from "react";
import { useGlobals } from "storybook/preview-api";

import {
	applyTheme,
	isThemeShortcut,
	saveTheme,
	type Theme,
} from "../src/components/theme.ts";

import "./preview.css";

const withThemeShortcut = (Story: () => React.ReactNode) => {
	const [globals, updateGlobals] = useGlobals();
	let theme: Theme = "system";

	if (globals.theme === "light" || globals.theme === "dark")
		theme = globals.theme;
	else if (!globals.theme) theme = "light";

	React.useEffect(() => {
		applyTheme({ theme });
		saveTheme({ theme });

		const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

		const updateSystemTheme = () => {
			if (theme === "system") applyTheme({ theme });
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			if (!isThemeShortcut({ event })) return;

			event.preventDefault();
			updateGlobals({ theme: theme === "light" ? "dark" : "light" });
		};

		systemTheme.addEventListener("change", updateSystemTheme);
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			systemTheme.removeEventListener("change", updateSystemTheme);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [theme, updateGlobals]);

	return React.createElement(Story);
};

const preview: Preview = {
	initialGlobals: { theme: "light" },
	globalTypes: {
		theme: {
			description: "Theme",
			toolbar: {
				title: "Theme",
				icon: "paintbrush",
				items: [
					{ value: "light", title: "Light" },
					{ value: "dark", title: "Dark" },
				],
				dynamicTitle: true,
			},
		},
	},
	decorators: [withThemeShortcut],
	parameters: {
		layout: "centered",
		options: {
			storySort: {
				method: "alphabetical",
				includeNames: true,
				order: [
					"Foundation",
					[
						"Typography",
						"Colors",
						"Buttons",
						"Icons",
						"Spinner",
						"Spacing and rounding",
					],
					"Controls",
					[
						"Form",
						"Input",
						"InputSearch",
						"InputTime",
						"Select",
						"SelectMulti",
						"Textarea",
						"Checkbox",
						"Toggle",
						"Slider",
					],
					"Components",
				],
			},
		},
		viewport: {
			options: {
				desktop: {
					name: "Desktop",
					styles: { width: "1280px", height: "700px" },
				},
				tablet: {
					name: "Tablet",
					styles: { width: "768px", height: "1024px" },
				},
				mobile: { name: "Mobile", styles: { width: "390px", height: "844px" } },
			},
		},
	},
};

export default preview;

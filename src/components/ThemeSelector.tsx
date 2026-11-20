"use client";

import cx from "clsx-tw";
import * as React from "react";
import { IMonitor, IMoon, ISun } from "../icons.tsx";
import { Tooltip } from "./Tooltip.tsx";

import {
	applyTheme,
	getTheme,
	isThemeShortcut,
	nextTheme,
	saveTheme,
	type Theme,
} from "./theme.ts";

export type ThemeSelectorProps = {
	className?: string;
	tooltipPlacement?: "top" | "bottom";
};

const themeIcons: Record<Theme, typeof IMonitor> = {
	system: IMonitor,
	light: ISun,
	dark: IMoon,
};

const themeLabels: Record<Theme, string> = {
	system: "System",
	light: "Light",
	dark: "Dark",
};

export const ThemeSelector = ({
	className,
	tooltipPlacement = "top",
}: ThemeSelectorProps) => {
	const [theme, setTheme] = React.useState<Theme>("system");
	const themeRef = React.useRef<Theme>("system");
	const Icon = themeIcons[theme];
	const label = themeLabels[theme];

	React.useEffect(() => {
		const savedTheme = getTheme();
		const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

		const updateSystemTheme = () => {
			if (themeRef.current === "system") applyTheme({ theme: "system" });
		};

		themeRef.current = savedTheme;
		setTheme(savedTheme);
		applyTheme({ theme: savedTheme });

		systemTheme.addEventListener("change", updateSystemTheme);
		return () => systemTheme.removeEventListener("change", updateSystemTheme);
	}, []);

	const cycleTheme = ({
		skipSystem = false,
	}: {
		skipSystem?: boolean;
	} = {}) => {
		let next = nextTheme({ theme: themeRef.current });

		if (skipSystem) {
			const dark =
				themeRef.current === "system"
					? window.matchMedia("(prefers-color-scheme: dark)").matches
					: themeRef.current === "dark";

			next = dark ? "light" : "dark";
		}

		themeRef.current = next;
		setTheme(next);
		saveTheme({ theme: next });
		applyTheme({ theme: next });
	};

	const handleClick = ({
		currentTarget,
	}: React.MouseEvent<HTMLButtonElement>) => {
		cycleTheme();
		currentTarget.blur();
	};

	React.useEffect(() => {
		const isThemeBackground = (target: EventTarget | null) =>
			target === document.body ||
			(target instanceof HTMLElement &&
				target.hasAttribute("data-theme-background"));

		const preventWordSelection = (event: MouseEvent) => {
			if (
				event.button === 0 &&
				event.detail === 2 &&
				isThemeBackground(event.target)
			)
				event.preventDefault();
		};

		const handleDoubleClick = (event: MouseEvent) => {
			if (isThemeBackground(event.target)) cycleTheme({ skipSystem: true });
		};

		document.body.addEventListener("mousedown", preventWordSelection);
		document.body.addEventListener("dblclick", handleDoubleClick);

		return () => {
			document.body.removeEventListener("mousedown", preventWordSelection);
			document.body.removeEventListener("dblclick", handleDoubleClick);
		};
	}, []);

	React.useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (!isThemeShortcut({ event })) return;

			event.preventDefault();
			cycleTheme({ skipSystem: true });
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, []);

	return (
		<div className={cx("fixed right-4 bottom-4 z-50", className)}>
			<Tooltip content={`Theme: ${label}`} placement={tooltipPlacement}>
				<button
					className="relative grid size-11 cursor-pointer place-items-center rounded-control border border-border bg-surface text-fg hover:bg-layer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
					onClick={handleClick}
					type="button"
				>
					<Icon className="size-5" />
				</button>
			</Tooltip>
		</div>
	);
};

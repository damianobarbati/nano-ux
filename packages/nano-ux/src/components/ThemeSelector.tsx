"use client";

import cx from "clsx-tw";
import * as React from "react";
import * as z from "zod/mini";
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

export const ThemeSelectorPropsSchema = z.object({
	className: z.optional(z.string()),
	defaultTheme: z.optional(z.enum(["system", "light", "dark"])),
	strings: z.optional(
		z.custom<
			Partial<Record<Theme, string>> & {
				themeLabel?: (name: string) => string;
			}
		>(),
	),
	toggleOnDoubleClick: z.optional(z.boolean()),
	tooltipPlacement: z.optional(z.enum(["top", "bottom"])),
});

export type ThemeSelectorProps = z.infer<typeof ThemeSelectorPropsSchema>;

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

const hitsText = (target: Element, event: MouseEvent) => {
	const range = document.createRange();

	for (const node of target.childNodes) {
		if (!(node instanceof Text)) continue;

		range.selectNodeContents(node);

		for (const rect of range.getClientRects()) {
			if (
				event.clientX >= rect.left &&
				event.clientX < rect.right &&
				event.clientY >= rect.top &&
				event.clientY < rect.bottom
			)
				return true;
		}
	}

	return false;
};

export const ThemeSelector = ({
	className,
	defaultTheme = "system",
	strings,
	toggleOnDoubleClick = true,
	tooltipPlacement = "top",
}: ThemeSelectorProps) => {
	const [theme, setTheme] = React.useState(defaultTheme);
	const themeRef = React.useRef(defaultTheme);
	const Icon = themeIcons[theme];
	const label = strings?.[theme] ?? themeLabels[theme];
	const themeLabel = strings?.themeLabel?.(label) ?? `Theme: ${label}`;

	React.useEffect(() => {
		const savedTheme = getTheme({ defaultTheme });
		const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

		const updateSystemTheme = () => {
			if (themeRef.current === "system") applyTheme({ theme: "system" });
		};

		themeRef.current = savedTheme;
		setTheme(savedTheme);
		applyTheme({ theme: savedTheme });

		systemTheme.addEventListener("change", updateSystemTheme);
		return () => systemTheme.removeEventListener("change", updateSystemTheme);
	}, [defaultTheme]);

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
		if (!toggleOnDoubleClick) return;

		const isThemeGesture = (event: MouseEvent) => {
			const target = event.target;

			const matches =
				event.button === 0 &&
				!event.defaultPrevented &&
				target instanceof Element &&
				!target.closest(
					"a, button, input, select, textarea, label, summary, [contenteditable], [role='button'], [role='link']",
				) &&
				!hitsText(target, event);

			return matches;
		};

		const preventWordSelection = (event: MouseEvent) => {
			if (event.detail === 2 && isThemeGesture(event)) event.preventDefault();
		};

		const handleDoubleClick = (event: MouseEvent) => {
			if (isThemeGesture(event)) cycleTheme({ skipSystem: true });
		};

		document.body.addEventListener("mousedown", preventWordSelection);
		document.body.addEventListener("dblclick", handleDoubleClick);

		return () => {
			document.body.removeEventListener("mousedown", preventWordSelection);
			document.body.removeEventListener("dblclick", handleDoubleClick);
		};
	}, [toggleOnDoubleClick]);

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
			<Tooltip content={themeLabel} placement={tooltipPlacement}>
				<button
					className="relative grid size-11 cursor-pointer place-items-center rounded-control border border-border bg-surface text-fg hover:bg-layer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
					aria-label={themeLabel}
					onClick={handleClick}
					type="button"
				>
					<Icon className="size-5" />
				</button>
			</Tooltip>
		</div>
	);
};

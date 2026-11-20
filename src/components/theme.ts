export type Theme = "dark" | "light" | "system";

type ThemeInput = { theme: Theme };

type ThemeShortcutInput = { event: KeyboardEvent };

type ThemeShortcutTargetInput = { target: EventTarget | null };

const themes: Theme[] = ["system", "light", "dark"];

const themeStorageKey = "nano-ui-theme";

const themeSelectedAtStorageKey = "nano-ui-theme-selected-at";

export const getTheme = (): Theme => {
	try {
		const theme = localStorage.getItem(themeStorageKey);
		const selectedAt = Number(localStorage.getItem(themeSelectedAtStorageKey));

		if (theme !== "light" && theme !== "dark" && theme !== "system")
			return "system";

		if (Number.isFinite(selectedAt) && selectedAt > 0) {
			const selectedDate = new Date(selectedAt);

			if (selectedDate.getHours() < 3) {
				const expiresAt = new Date(
					selectedDate.getFullYear(),
					selectedDate.getMonth(),
					selectedDate.getDate(),
					3,
				).getTime();

				if (Date.now() >= expiresAt) {
					localStorage.removeItem(themeStorageKey);
					localStorage.removeItem(themeSelectedAtStorageKey);
					return "system";
				}
			}
		}

		return theme;
	} catch {}

	return "system";
};

export const applyTheme = ({ theme }: ThemeInput) => {
	const root = document.documentElement;

	root.classList.toggle("light", theme === "light");
	root.classList.toggle("dark", theme === "dark");

	const themeColor = document.querySelector<HTMLMetaElement>(
		'#theme-color[name="theme-color"]',
	);

	if (themeColor) themeColor.content = getComputedStyle(root).backgroundColor;
};

export const saveTheme = ({ theme }: ThemeInput) => {
	try {
		localStorage.setItem(themeStorageKey, theme);
		localStorage.setItem(themeSelectedAtStorageKey, String(Date.now()));
	} catch {}
};

export const nextTheme = ({ theme }: ThemeInput) => {
	const index = themes.indexOf(theme);
	return themes[(index + 1) % themes.length];
};

const isThemeShortcutTarget = ({ target }: ThemeShortcutTargetInput) =>
	target instanceof HTMLElement &&
	Boolean(
		target.closest(
			'input, select, textarea, [contenteditable=""], [contenteditable="true"]',
		),
	);

export const isThemeShortcut = ({ event }: ThemeShortcutInput) => {
	const matches =
		!event.defaultPrevented &&
		event.shiftKey &&
		!event.altKey &&
		!event.ctrlKey &&
		!event.metaKey &&
		event.key.toLowerCase() === "t" &&
		!isThemeShortcutTarget({ target: event.target });

	return matches;
};

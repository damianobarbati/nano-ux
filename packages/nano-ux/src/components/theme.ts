export type Theme = "dark" | "light" | "system";

type ThemeInput = { theme: Theme };
type GetThemeInput = { defaultTheme?: Theme };

type ThemeShortcutInput = { event: KeyboardEvent };

type ThemeShortcutTargetInput = { target: EventTarget | null };

const themes: Theme[] = ["system", "light", "dark"];

const themeStorageKey = "nano-ux-theme";

const themeSelectedAtStorageKey = "nano-ux-theme-selected-at";

const migrateTheme = () => {
	const previousTheme = localStorage.getItem("nano-ui-theme");
	if (previousTheme === null) return;

	if (localStorage.getItem(themeStorageKey) === null) {
		const selectedAt = localStorage.getItem("nano-ui-theme-selected-at");

		if (selectedAt !== null)
			localStorage.setItem(themeSelectedAtStorageKey, selectedAt);

		localStorage.setItem(themeStorageKey, previousTheme);
	}

	localStorage.removeItem("nano-ui-theme");
	localStorage.removeItem("nano-ui-theme-selected-at");
};

export const getTheme = ({
	defaultTheme = "system",
}: GetThemeInput = {}): Theme => {
	try {
		migrateTheme();

		const theme = localStorage.getItem(themeStorageKey);
		const selectedAt = Number(localStorage.getItem(themeSelectedAtStorageKey));

		if (theme !== "light" && theme !== "dark" && theme !== "system")
			return defaultTheme;

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
					return defaultTheme;
				}
			}
		}

		return theme;
	} catch {}

	return defaultTheme;
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

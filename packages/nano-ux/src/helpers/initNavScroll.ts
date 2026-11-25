const setInstantScroll = (enabled: boolean) => {
	document.documentElement.toggleAttribute("data-nano-instant-scroll", enabled);
};

export const initNavScroll = () => {
	if (typeof window === "undefined") return;

	const browser = window as Window & { nanoNavScrollInitialized?: boolean };
	if (browser.nanoNavScrollInitialized) return;

	const navigation = window.navigation;

	setInstantScroll(
		!navigation || navigation.activation?.navigationType === "traverse",
	);

	if (navigation) {
		navigation.addEventListener("navigate", (event) => {
			setInstantScroll(event.navigationType === "traverse");
		});
	}

	window.addEventListener("pageshow", (event) => {
		if (event.persisted) setInstantScroll(true);
	});

	browser.nanoNavScrollInitialized = true;
};

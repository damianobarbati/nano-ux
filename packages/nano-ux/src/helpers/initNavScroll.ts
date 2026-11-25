const setInstantScroll = (enabled: boolean) => {
	document.documentElement.toggleAttribute("data-nano-instant-scroll", enabled);
};

export const initNavScroll = () => {
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
};

import stylesheet from "./src/style/theme.css?url";

export default {
	title: "nano-ux",
	assetsDir: "../website/public",
	stylesheet,
	order: ["Foundation", "Controls", "Components"],
	componentOrder: [
		"Typography",
		"Colors",
		"Buttons",
		"Icons",
		"Spinner",
		"Spacing & Rounding",
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
};

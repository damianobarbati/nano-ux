import preset from "nano-ssg/preact";
import { mergeConfig } from "vite";

export default mergeConfig(preset, {
	root: import.meta.dirname,
	base: "/nano-ux/",
	build: { outDir: "dist" },
});

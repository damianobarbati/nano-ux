import preset from "nano-ssg/config";
import { mergeConfig } from "vite";

export default mergeConfig(preset, {
	root: import.meta.dirname,
	base: "/nano-ux/",
	build: { outDir: "dist" },
});

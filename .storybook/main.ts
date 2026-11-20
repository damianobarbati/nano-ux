import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

const config: StorybookConfig = {
	stories: ["../src/stories/*.stories.tsx"],
	framework: "@storybook/react-vite",
	viteFinal: async (config) => {
		config.optimizeDeps ??= {};

		config.optimizeDeps.include = [
			...(config.optimizeDeps.include ?? []),
			"react-icons/tb",
		];

		config.plugins = [...(config.plugins || []), tailwindcss(), react()];
		return config;
	},
};

export default config;

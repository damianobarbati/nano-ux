import type { Plugin } from "vite";

const createFormatter = async () => {
	const { Biome } = await import("@biomejs/js-api/nodejs");
	const biome = new Biome();

	try {
		const { projectKey } = biome.openProject(".");

		biome.applyConfiguration(projectKey, {
			files: { maxSize: 0xffffffff },
			formatter: { indentStyle: "space", indentWidth: 2 },
			html: {
				formatter: {
					enabled: true,
					whitespaceSensitivity: "strict",
					indentScriptAndStyle: true,
				},
			},
		});

		const format = ({
			source,
			filePath,
		}: {
			source: string;
			filePath: string;
		}) => {
			const result = biome.formatContent(projectKey, source, { filePath });

			const error = result.diagnostics.find(
				({ severity }) => severity === "error" || severity === "fatal",
			);

			if (error) throw new Error(`${filePath}: ${error.description}`);
			return result.content;
		};

		return { format, close: () => biome.shutdown() };
	} catch (error) {
		biome.shutdown();
		throw error;
	}
};

export const formatHtml = (): Plugin => {
	let formatter: ReturnType<typeof createFormatter> | undefined;
	return {
		name: "ssg:format-html",
		enforce: "post",
		applyToEnvironment(environment) {
			return environment.name === "client";
		},
		transformIndexHtml: {
			order: "post",
			async handler(source, context) {
				if (!context.server) return;

				formatter ??= createFormatter();

				const { format } = await formatter;
				const result = format({ source, filePath: "index.html" });
				return result;
			},
		},
		generateBundle: {
			order: "post",
			async handler(_options, bundle) {
				for (const page of Object.values(bundle)) {
					if (page.type !== "asset" || !page.fileName.endsWith(".html"))
						continue;

					formatter ??= createFormatter();

					const { format } = await formatter;

					const source =
						typeof page.source === "string"
							? page.source
							: Buffer.from(page.source).toString("utf8");

					page.source = format({ source, filePath: page.fileName });
				}
			},
		},
		async closeBundle() {
			if (!formatter) return;

			const instance = await formatter;

			formatter = undefined;
			instance.close();
		},
	};
};

import * as React from "react";
import * as z from "zod/mini";

import {
	ThemeSelector,
	ThemeSelectorPropsSchema,
} from "../../components/ThemeSelector.tsx";

export const Preview = function Preview() {
	const [enabled, setEnabled] = React.useState(true);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEnabled(event.currentTarget.checked);
	};

	return (
		<div>
			<p>
				<span>Sample text</span>
			</p>
			<label>
				<input checked={enabled} onChange={handleChange} type="checkbox" />
				Toggle on double-click
			</label>
			<input aria-label="Example text" defaultValue="Sample text" />
			<ThemeSelector toggleOnDoubleClick={enabled} />
		</div>
	);
};

export const schema = z.pick(ThemeSelectorPropsSchema, {
	defaultTheme: true,
	toggleOnDoubleClick: true,
	tooltipPlacement: true,
});

export const Playground = (props: z.infer<typeof schema>) => (
	<ThemeSelector className="static" {...props} />
);

export const section = "Components";

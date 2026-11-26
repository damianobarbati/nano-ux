import React from "react";
import * as z from "zod/mini";
import { Button } from "../../components/Button.tsx";
import { Tooltip, TooltipPropsSchema } from "../../components/Tooltip.tsx";

export const Preview = () => (
	<Tooltip content="Save the current document">
		<Button>Save</Button>
	</Tooltip>
);

export const schema = z.pick(TooltipPropsSchema, { placement: true });

export const Playground = (props: z.infer<typeof schema>) => (
	<Tooltip
		content="Save changes"
		children={<button type="button">Save</button>}
		{...props}
	/>
);

export const section = "Components";

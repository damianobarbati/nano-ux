import React from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../components/Button.tsx";
import { Tooltip } from "../components/Tooltip.tsx";

export default { title: "Components / Tooltip", component: Tooltip };

export const Example = {
	name: "Tooltip",
	render: () => (
		<Tooltip content="Save the current document">
			<Button>Save</Button>
		</Tooltip>
	),
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const button = within(canvasElement).getByRole("button");

		const bubble = within(canvasElement).getByText("Save the current document");

		await userEvent.hover(button);
		await waitFor(() => expect(bubble).toBeVisible());

		const bounds = bubble.getBoundingClientRect();

		await expect(bounds.bottom).toBeLessThan(
			button.getBoundingClientRect().top,
		);

		await expect(bounds.right).toBeLessThanOrEqual(
			canvasElement.ownerDocument.documentElement.clientWidth,
		);

		await expect(
			canvasElement.ownerDocument.elementFromPoint(bounds.x + 4, bounds.y + 4),
		).toBe(bubble);

		await userEvent.hover(bubble);
		await userEvent.click(bubble);
		await expect(bubble.closest(":popover-open")).toBeTruthy();

		await userEvent.keyboard("{Escape}");
		await waitFor(() => expect(bubble).not.toBeVisible());
	},
};

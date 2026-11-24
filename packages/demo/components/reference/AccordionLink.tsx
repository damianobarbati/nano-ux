import { Button, Tooltip } from "nano-ux";

type AccordionLinkProps = { className?: string };

export const AccordionLink = ({ className }: AccordionLinkProps) => (
	<Tooltip content="Jump to the Accordion example" placement="bottom">
		<Button
			className={className}
			as="a"
			href="#reference-accordion"
			variant="outline"
		>
			Billing details
		</Button>
	</Tooltip>
);

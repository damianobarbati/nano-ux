import { Accordion } from "nano-ux";

type BillingDetailsProps = { className?: string };

export const BillingDetails = ({ className }: BillingDetailsProps) => (
	<Accordion
		className={className}
		title="Billing details"
		summary="Monthly plan"
	>
		<p>Invoices are sent to your billing email address.</p>
	</Accordion>
);

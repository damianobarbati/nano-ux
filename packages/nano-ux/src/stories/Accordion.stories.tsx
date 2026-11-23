import { Accordion as AccordionComponent } from "../components/Accordion.tsx";

export default {
	title: "Components / Accordion",
	component: AccordionComponent,
};

export const Accordion = {
	args: {
		title: "Billing details",
		summary: "Monthly plan",
		children: "Invoices are sent to your billing email address.",
	},
};

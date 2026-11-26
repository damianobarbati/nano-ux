import * as z from "zod/mini";

import {
	Accordion as AccordionComponent,
	AccordionPropsSchema,
} from "../../components/Accordion.tsx";

const exampleProps = {
	title: "Billing details",
	summary: "Monthly plan",
	children: "Invoices are sent to your billing email address.",
};

export const Preview = () => <AccordionComponent {...exampleProps} />;

export const schema = z.pick(AccordionPropsSchema, {
	title: true,
	summary: true,
	action: true,
	defaultExpanded: true,
	disabled: true,
});

export const defaults = { title: "Billing details" };

export const Playground = (props: z.infer<typeof schema>) => (
	<AccordionComponent {...exampleProps} {...props} />
);

export const section = "Components";

import * as z from "zod/mini";
import { NotFound, NotFoundPropsSchema } from "../../components/NotFound.tsx";

export const Preview = () => <NotFound />;

export const schema = z.pick(NotFoundPropsSchema, {
	title: true,
	href: true,
	actionLabel: true,
});

export const Playground = (props: z.infer<typeof schema>) => (
	<NotFound {...props} />
);

export const section = "Components";

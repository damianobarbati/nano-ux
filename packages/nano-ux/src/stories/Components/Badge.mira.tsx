import * as z from "zod/mini";
import { Badge, BadgePropsSchema } from "../../components/Badge.tsx";

export const Preview = () => (
	<div className="flex flex-wrap items-center gap-2">
		<Badge>Default</Badge>
		<Badge className="badge-success">Live</Badge>
		<Badge className="badge-warning">Warning</Badge>
		<Badge className="badge-error">Error</Badge>
		<Badge size="sm">Small</Badge>
	</div>
);

export const schema = z.pick(BadgePropsSchema, { size: true, className: true });

export const Playground = (props: z.infer<typeof schema>) => (
	<Badge children="Badge" {...props} />
);

export const section = "Components";

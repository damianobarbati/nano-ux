import { Badge } from "../components/Badge.tsx";

export default { title: "Components / Badge", component: Badge };

export const Variants = {
	name: "Badge",
	render: () => (
		<div className="flex flex-wrap items-center gap-2">
			<Badge>Default</Badge>
			<Badge className="badge-success">Live</Badge>
			<Badge className="badge-warning">Warning</Badge>
			<Badge className="badge-error">Error</Badge>
			<Badge size="sm">Small</Badge>
		</div>
	),
};

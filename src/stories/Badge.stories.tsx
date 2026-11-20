export default { title: "Components / Badge" };

export const Variants = {
	name: "Badge",
	render: () => (
		<div className="flex gap-2">
			<span className="badge">Default</span>
			<span className="badge badge-success">Live</span>
			<span className="badge badge-warning">Warning</span>
			<span className="badge badge-error">Error</span>
		</div>
	),
};

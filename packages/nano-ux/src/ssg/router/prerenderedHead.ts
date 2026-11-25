export const clearPrerenderedHead = () => {
	const nodes = document.head.querySelectorAll(
		':scope > [data-ssg-head]:is(title, meta, link[rel="canonical"], link[rel="alternate"][hreflang], script[type="application/ld+json"])',
	);

	for (const node of nodes) node.remove();
};

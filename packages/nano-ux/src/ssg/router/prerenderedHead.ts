export const clearPrerenderedHead = () => {
	let insideRouteHead = false;

	for (const node of Array.from(document.head.childNodes)) {
		if (
			node.nodeType === Node.COMMENT_NODE &&
			node.textContent === "ssg-head-start"
		)
			insideRouteHead = true;

		if (
			node.nodeType === Node.COMMENT_NODE &&
			node.textContent === "ssg-head-end"
		)
			break;

		if (
			insideRouteHead &&
			node instanceof Element &&
			node.matches(
				'title, meta, link[rel="canonical"], link[rel="alternate"][hreflang], script[type="application/ld+json"]',
			)
		) {
			node.remove();
		}
	}
};

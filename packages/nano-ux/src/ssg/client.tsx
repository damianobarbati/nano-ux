import { Router } from "virtual:ssg/router";
import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";

const root = document.getElementById("root");
if (!root) throw new Error("Missing root element.");

const prerendered = root.hasChildNodes();

const app = (
	<React.StrictMode>
		<Router ssrPath={prerendered ? window.location.pathname : undefined} />
	</React.StrictMode>
);

if (prerendered) {
	hydrateRoot(root, app);
} else {
	createRoot(root).render(app);
}

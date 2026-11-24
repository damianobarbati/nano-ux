import { createRoot } from "react-dom/client";
import { Header } from "./components/reference/Header.tsx";

const root = document.getElementById("root");
if (root) createRoot(root).render(<Header className="py-3" />);

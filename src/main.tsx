import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n";
import { scheduleTokenRefresh } from "./lib/api";

// Resume auto-logout timer if a token is already in localStorage on page load
const existingToken = localStorage.getItem("npp_token");
if (existingToken) scheduleTokenRefresh(existingToken);

createRoot(document.getElementById("root")!).render(<App />);

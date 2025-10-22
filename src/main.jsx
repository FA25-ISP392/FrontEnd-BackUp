import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { getOriginalBackendUrl, PROXY_PREFIX } from "./api/apiConfig";

try {
  const real = getOriginalBackendUrl();
  console.info("[Backend] REAL_BACKEND_BASE:", real);
  console.info("[Backend] PROXY_PREFIX:", PROXY_PREFIX);
  console.info(
    "[Backend] running in dev mode:",
    import.meta.env.DEV ? "dev (proxy active)" : "prod"
  );
} catch (e) {
  console.debug("Could not determine backend info:", e);
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

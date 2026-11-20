import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles.css";

// #root holds the landing page as the build drew it (src/ssr.tsx), for readers that run no JavaScript; the app draws over it
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

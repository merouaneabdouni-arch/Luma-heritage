import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { Partners } from "./Partners";

// Simple routing based on URL path
const path = window.location.pathname;
const Component = path === "/partners" ? Partners : App;

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <Component />
  </StrictMode>
);

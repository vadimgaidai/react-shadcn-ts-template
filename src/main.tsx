import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"

import "./shared/assets/global.css"
import "@/shared/config/env"
import "@/shared/config/i18n"

import App from "@/app"

const rootElement = document.getElementById("root")

if (!rootElement) {
  throw new Error("Failed to find root element. Check your index.html.")
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

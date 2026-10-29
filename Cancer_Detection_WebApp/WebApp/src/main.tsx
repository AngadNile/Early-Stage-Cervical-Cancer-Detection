import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { I18nProvider } from "@/lib/i18n-context"
import { ThemeProvider } from "@/components/theme-provider"
import App from "./App"
import "@/app/globals.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
      <I18nProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </I18nProvider>
    </ThemeProvider>
  </React.StrictMode>
)

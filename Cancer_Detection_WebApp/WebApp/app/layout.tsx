import type React from "react"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import { I18nProvider } from "@/lib/i18n-context"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>CerviCare — Early Detection, Early Protection</title>
        <meta name="description" content="AI-powered cervical cancer screening system connecting ASHA workers, doctors, and patients in rural communities." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <I18nProvider>
            <Suspense fallback={null}>
              {children}
              <Toaster />
            </Suspense>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="w-9 h-9 p-0 rounded-full"
        aria-label="Toggle theme"
      >
        <span className="w-4 h-4" />
      </Button>
    )
  }

  const isDark = theme === "dark"

  return (
    <Button
      id="theme-toggle-btn"
      variant="outline"
      size="sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-9 h-9 p-0 rounded-full relative overflow-hidden border-2 transition-all duration-300
        hover:scale-110 hover:shadow-lg
        dark:border-indigo-400 dark:bg-slate-800 dark:hover:bg-slate-700
        border-indigo-200 bg-white hover:bg-indigo-50"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span
        className="absolute inset-0 flex items-center justify-center transition-all duration-500"
        style={{
          opacity: isDark ? 0 : 1,
          transform: isDark ? "rotate(90deg) scale(0)" : "rotate(0deg) scale(1)",
        }}
      >
        <Sun className="w-4 h-4 text-amber-500" />
      </span>
      <span
        className="absolute inset-0 flex items-center justify-center transition-all duration-500"
        style={{
          opacity: isDark ? 1 : 0,
          transform: isDark ? "rotate(0deg) scale(1)" : "rotate(-90deg) scale(0)",
        }}
      >
        <Moon className="w-4 h-4 text-indigo-400" />
      </span>
    </Button>
  )
}

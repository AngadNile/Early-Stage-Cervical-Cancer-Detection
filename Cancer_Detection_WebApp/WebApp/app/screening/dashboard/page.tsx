"use client"

import AuthGuard from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { logout, getCurrentUser } from "@/lib/auth"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { BrandLogo } from "@/components/brand-logo"
import ScreeningDashboard from "@/components/screening/screening-dashboard"
import { LogOut } from "lucide-react"

const ROLE_LABELS: Record<string, string> = {
  doctor: "Doctor",
  lab: "Laboratory",
  pathology: "Pathology",
  screening_van: "Screening Van",
}

export default function ScreeningDashboardPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const user = getCurrentUser()

  const handleLogout = () => {
    logout()
    toast({ title: "Logged out", description: "You have been logged out." })
    navigate("/login")
  }

  return (
    <AuthGuard allowedRoles={["doctor", "lab", "pathology", "screening_van"]}>
      <div className="min-h-screen bg-gradient-to-br from-[#fdfaf7] via-teal-50/60 to-teal-100/30 dark:from-slate-950 dark:via-teal-950/30 dark:to-slate-950">

        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-slate-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-4">
                <BrandLogo subtitle="Screening Unit" href="/screening/dashboard" />
                <span className="hidden md:inline-block text-xs text-gray-400 border-l border-gray-200 dark:border-slate-700 pl-3">
                  <span className="text-teal-600 dark:text-teal-400 font-medium">{user?.name}</span>
                  <span className="ml-1 text-gray-400">· {ROLE_LABELS[user?.role ?? ""] ?? user?.role}</span>
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <LanguageSwitcher />
                <ThemeToggle />
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="gap-2 border-gray-200 dark:border-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ScreeningDashboard />
        </main>
      </div>
    </AuthGuard>
  )
}

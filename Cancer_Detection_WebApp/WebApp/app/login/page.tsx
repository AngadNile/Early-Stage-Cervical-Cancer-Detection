"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authenticateUser, setCurrentUser, getDashboardPathForRole } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { useI18n } from "@/lib/i18n-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft, Activity, Eye, EyeOff, Lock, Mail } from "lucide-react"

export default function LoginPage() {
  const navigate = useNavigate()
  const router = {
    push: (path: string) => navigate(path),
    replace: (path: string) => navigate(path, { replace: true }),
  }
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { t } = useI18n()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const user = await authenticateUser(email, password)

      if (user) {
        setCurrentUser(user)
        console.log("[v0] Login: authenticated role=", user.role)
        toast({
          title: t.common.success,
          description: `${t.common.welcome}, ${user.name}!`,
        })

        const path = getDashboardPathForRole(user.role)
        console.log("[v0] Login: redirecting to", path)
        router.replace(path)
      } else {
        toast({
          title: "Login failed",
          description: "We couldn't determine your profile. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Login error:", error)
      const message = error instanceof Error ? error.message : "An error occurred during login. Please try again."
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#fdfaf7] via-teal-50 to-teal-100 dark:from-slate-950 dark:via-teal-950/30 dark:to-slate-950">
      
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="animate-blob absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-300/40 dark:bg-indigo-700/20 blur-3xl" />
        <div className="animate-blob animation-delay-2000 absolute top-1/2 -right-32 w-80 h-80 rounded-full bg-purple-300/40 dark:bg-purple-700/20 blur-3xl" />
        <div className="animate-blob2 animation-delay-4000 absolute -bottom-32 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-pink-300/30 dark:bg-pink-700/15 blur-3xl" />
      </div>

      {/* Top navigation */}
      <div className="absolute top-4 left-4">
        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-slate-800 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.common.back}
        </Button>
      </div>
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md mx-4 animate-fade-in-up">
        
        {/* Glow behind card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-teal-700 rounded-3xl blur-lg opacity-20 dark:opacity-30" />

        <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-gray-200/80 dark:border-slate-700/80 shadow-2xl overflow-hidden">
          
          {/* Card Header */}
          <div className="bg-gradient-to-br from-teal-600 to-teal-800 p-8 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,white,transparent_60%)]" />
            <div className="relative">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-medium mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-200 animate-pulse" />
                Early Detection · Early Protection
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight">CerviCare</h1>
              <p className="text-teal-100 text-sm mt-1">{t.auth.loginTitle}</p>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t.common.email}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t.auth.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-11 border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-400 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t.auth.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 pr-10 h-11 border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-400 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium transition-colors"
                >
                  {t.auth.forgotPassword}
                </Link>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white border-0 font-semibold shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:scale-[1.02] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t.common.loading}
                  </span>
                ) : t.auth.signIn}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white dark:bg-slate-900 px-3 text-gray-400">OR</span>
              </div>
            </div>

            {/* Create account link */}
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Don&apos;t have an account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                >
                  {t.auth.createAccount}
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
          <Lock className="w-3 h-3" />
          Secured with end-to-end encryption
        </div>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Activity, Eye, EyeOff, Lock, Mail, MapPin, Phone, User, ShieldCheck } from "lucide-react"
import { createAdmin } from "@/lib/auth"
import { ThemeToggle } from "@/components/theme-toggle"

export default function SignupPage() {
  const navigate = useNavigate()
  const router = {
    push: (path: string) => navigate(path),
    replace: (path: string) => navigate(path, { replace: true }),
  }
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    region: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const result = await createAdmin({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        region: formData.region,
      })

      if (result.success) {
        toast({
          title: "Account created successfully",
          description: "Admin account has been created. You can now login.",
        })
        router.push("/login")
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      console.error("[v0] Signup error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const fields = [
    {
      id: "name",
      label: "Full Name",
      type: "text",
      placeholder: "Enter your full name",
      icon: User,
      required: true,
    },
    {
      id: "email",
      label: "Email Address",
      type: "email",
      placeholder: "Enter your email address",
      icon: Mail,
      required: true,
    },
    {
      id: "phone",
      label: "Phone Number",
      type: "tel",
      placeholder: "Enter your phone number",
      icon: Phone,
      required: true,
    },
    {
      id: "region",
      label: "Region",
      type: "text",
      placeholder: "e.g., Nagpur, Mumbai",
      icon: MapPin,
      required: true,
    },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#fdfaf7] via-teal-50 to-teal-100 dark:from-slate-950 dark:via-teal-950/30 dark:to-slate-950 py-8">
      
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="animate-blob absolute -top-32 -right-32 w-96 h-96 rounded-full bg-teal-300/40 dark:bg-teal-700/20 blur-3xl" />
        <div className="animate-blob animation-delay-2000 absolute top-1/3 -left-32 w-80 h-80 rounded-full bg-teal-200/40 dark:bg-teal-800/20 blur-3xl" />
        <div className="animate-blob2 animation-delay-4000 absolute -bottom-32 right-1/3 w-72 h-72 rounded-full bg-rose-200/20 dark:bg-rose-900/10 blur-3xl" />
      </div>

      {/* Top navigation */}
      <div className="absolute top-4 left-4">
        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-slate-800 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Signup Card */}
      <div className="relative w-full max-w-lg mx-4 animate-fade-in-up">

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
                <ShieldCheck className="w-3 h-3" />
                Admin Registration
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight">CerviCare</h1>
              <p className="text-teal-100 text-sm mt-1">Sign up as System Administrator</p>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Standard fields */}
              {fields.map((field) => (
                <div key={field.id} className="space-y-1.5">
                  <Label htmlFor={field.id} className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {field.label} <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id={field.id}
                      name={field.id}
                      type={field.type}
                      value={formData[field.id as keyof typeof formData]}
                      onChange={handleInputChange}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="pl-10 h-11 border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-400 transition-all duration-200"
                    />
                  </div>
                </div>
              ))}

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Password <span className="text-red-400">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter password (min 6 characters)"
                    required
                    className="pl-10 pr-10 h-11 border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-200"
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

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Confirm Password <span className="text-red-400">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    required
                    className="pl-10 pr-10 h-11 border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white border-0 font-semibold shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:scale-[1.02] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating Account...
                  </span>
                ) : "Create Account"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white dark:bg-slate-900 px-3 text-gray-400">OR</span>
              </div>
            </div>

            {/* Login link */}
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
          <ShieldCheck className="w-3 h-3" />
          Your data is protected with military-grade encryption
        </div>
      </div>
    </div>
  )
}

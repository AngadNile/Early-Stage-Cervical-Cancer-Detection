"use client"

import type React from "react"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp"
import { BrandLogo } from "@/components/brand-logo"

type Step = "email" | "otp"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [generatedOtp, setGeneratedOtp] = useState("")
  const [step, setStep] = useState<Step>("email")
  const [isSending, setIsSending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const { toast } = useToast()

  const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000))

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      })
      return
    }
    setIsSending(true)
    try {
      const code = generateOtp()
      setGeneratedOtp(code)
      toast({
        title: "OTP sent",
        description: `For preview use only. Your OTP is ${code}. It expires in 10 minutes.`,
      })
      setStep("otp")
    } catch (err) {
      toast({
        title: "Could not send OTP",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleVerifyOtpAndSendReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit code sent to your email.",
        variant: "destructive",
      })
      return
    }
    setIsVerifying(true)
    try {
      if (otp !== generatedOtp) {
        throw new Error("Incorrect OTP. Please try again.")
      }
      toast({
        title: "OTP verified",
        description: "Password reset link sent to your email. Check your inbox.",
      })
      setTimeout(() => {
        window.location.href = "/login"
      }, 1500)
    } catch (err) {
      toast({
        title: "Verification failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdfaf7] via-teal-50 to-teal-100 dark:from-slate-950 dark:via-teal-950/30 dark:to-slate-950 p-4">
      <Card className="w-full max-w-md shadow-xl border-gray-200/80 dark:border-slate-700/80">
        <CardHeader className="space-y-3 text-center">
          <div className="flex justify-center pb-2">
            <BrandLogo href="/" />
          </div>
          <CardTitle className="text-xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            {step === "email"
              ? "Enter your email to receive a one-time passcode (OTP)."
              : "Enter the 6-digit OTP sent to your email. After verification, we'll email you a reset link."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "email" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSending}>
                {isSending ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtpAndSendReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <InputOTP maxLength={6} value={otp} onChange={setOtp} containerClassName="w-full justify-center">
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isVerifying}>
                {isVerifying ? "Verifying..." : "Verify OTP & Send Reset Link"}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-sm text-blue-600 hover:underline"
                  disabled={isSending}
                >
                  {isSending ? "Resending..." : "Resend OTP"}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-blue-600 hover:underline">
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

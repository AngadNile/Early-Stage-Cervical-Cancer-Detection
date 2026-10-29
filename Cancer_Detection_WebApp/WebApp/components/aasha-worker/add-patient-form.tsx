"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useI18n } from "@/lib/i18n-context"
import FileUpload from "@/components/ui/file-upload"
import VoiceRecorder from "@/components/ui/voice-recorder"
import { UserPlus, Phone, Mic, Camera, CheckCircle2 } from "lucide-react"
import { registerNewUser, getCurrentUser } from "@/lib/auth"
import { cervixAnalysisService } from "@/lib/api-services"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

export default function AddPatientForm() {
  const [patientData, setPatientData] = useState({
    name: "",
    age: "",
    gender: "",
    village: "",
    city: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    medicalHistory: "",
    symptoms: "",
  })
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [aiResult, setAiResult] = useState<{ label: "normal" | "mild" | "abnormal"; confidence: number } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false)
  const [step, setStep] = useState<"idle" | "creating" | "uploading" | "saving" | "done">("idle")
  const [progress, setProgress] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successPatientId, setSuccessPatientId] = useState<string | null>(null)
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const { toast } = useToast()
  const { t } = useI18n()

  const handleInputChange = (field: string, value: string) => {
    setPatientData((prev) => ({ ...prev, [field]: value }))
  }

  // ── MOCK AI ──────────────────────────────────────────────────────────────
  // Replace this function body with a real fetch() to your Python model API
  // when ready. The UI (result card, risk badge) will work without any change.
  const mockAiAnalysis = (): Promise<{ label: "normal" | "mild" | "abnormal"; confidence: number }> =>
    new Promise((resolve) =>
      setTimeout(() => {
        const rand = Math.random()
        if (rand < 0.55) resolve({ label: "normal",   confidence: 88 + Math.random() * 10 })
        else if (rand < 0.80) resolve({ label: "mild", confidence: 72 + Math.random() * 15 })
        else                  resolve({ label: "abnormal", confidence: 85 + Math.random() * 12 })
      }, 2200)
    )
  // ─────────────────────────────────────────────────────────────────────────

  const handleFileSelect = async (file: File, preview: string) => {
    setSelectedFile(file)
    setUploadedImage(preview)
    setAiResult(null)
    setIsAnalyzingImage(true)

    try {
      // Simulation of AI analysis using mock model until python model API is attached
      const result = await mockAiAnalysis()
      setAiResult(result)
      setUploadedImageUrl(preview)
      toast({
        title: "AI Analysis Complete",
        description: `Result: ${result.label.toUpperCase()} (${result.confidence.toFixed(1)}% confidence)`,
      })
    } catch (error) {
      console.error("[v0] Error during AI analysis:", error)
      toast({
        title: "Analysis Failed",
        description: "Could not complete image analysis. Please try uploading again.",
        variant: "destructive",
      })
      setSelectedFile(null)
      setUploadedImage(null)
    } finally {
      setIsAnalyzingImage(false)
    }
  }

  const handleFileRemove = () => {
    setSelectedFile(null)
    setUploadedImage(null)
    setAiResult(null)
    setUploadedImageUrl(null)
  }

  const handleVoiceTranscriptChange = (transcript: string) => {
    setPatientData((prev) => ({
      ...prev,
      symptoms: transcript,
    }))
  }

  const generatePatientId = () =>
    `PAT${Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, "0")}`

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsSubmitting(true)
    setStep("creating")
    setProgress(30)

    try {
      const asha = getCurrentUser()
      if (!asha?.id) {
        throw new Error("Your session has expired. Please log in again as an ASHA Worker and retry.")
      }

      if (!patientData.email) {
        throw new Error("Email is required to create a patient login.")
      }

      const password = (patientData.password || "").trim()
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long.")
      }

      const patientIdCode = generatePatientId()
      const userData = {
        patientId: patientIdCode,
        name: patientData.name.trim(),
        age: Number(patientData.age || 0),
        gender: patientData.gender || "female",
        phone: patientData.phone || "",
        address: patientData.address || `${patientData.village || ""} ${patientData.city || ""}`.trim(),
        medicalHistory: patientData.medicalHistory || "",
        ashaWorkerId: asha.id,
        symptoms: patientData.symptoms || "",
      }

      const result = await registerNewUser(patientData.email.trim(), password, "patient", userData)
      if (!result.success || !result.user?.id) {
        throw new Error(result.error || "Failed to register patient.")
      }

      setProgress(100)
      setStep("done")

      setSuccessPatientId(patientIdCode)
      setShowSuccess(true)

      toast({
        title: "Patient registered & referred successfully",
        description: `Patient ID: ${patientIdCode}. Connected for clinical screening.`,
      })

      setPatientData({
        name: "",
        age: "",
        gender: "",
        village: "",
        city: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        medicalHistory: "",
        symptoms: "",
      })
      setShowVoiceRecorder(false)
      setStep("idle")
      setProgress(0)
    } catch (error: any) {
      const raw = error?.message || String(error)
      let explanation = raw

      if (/email[- ]already[- ]in[- ]use|auth\/email-already-in-use/i.test(raw)) {
        explanation = "This email is already registered. Ask the patient to use a different email or sign in."
      } else if (/invalid[- ]email|auth\/invalid-email/i.test(raw)) {
        explanation = "The email address appears to be invalid. Please check and try again."
      } else if (/weak[- ]password|auth\/weak-password/i.test(raw)) {
        explanation = "The password is too weak. Use at least 6 characters and try again."
      } else if (/network|timeout/i.test(raw)) {
        explanation = "A network error occurred. Check your connection and try again."
      }

      toast({
        title: "Could not register patient",
        description: explanation,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {isSubmitting && (
        <div className="max-w-4xl mx-auto">
          <Progress value={progress} />
          <p className="text-xs text-muted-foreground mt-1">
            {step === "creating" && "Registering patient & generating referral..."}
            {step === "done" && "Completed"}
          </p>
        </div>
      )}

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Patient Registration & Community Referral
          </CardTitle>
          <CardDescription>
            Register rural community members and connect them to nearby clinical screening points or mobile health camps.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Step 1: Patient Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-teal-50 dark:bg-teal-900/30 rounded-lg border border-teal-200 dark:border-teal-800">
                <UserPlus className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                <div>
                  <h3 className="font-semibold text-teal-900 dark:text-teal-200">Step 1: Patient Information & Registration</h3>
                  <p className="text-xs text-teal-700 dark:text-teal-300">Enter personal & contact details to generate a unique patient ID.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-md font-medium">{t.ashaWorker.patientDetails}</h4>

                  <div className="space-y-2">
                    <Label htmlFor="name">{t.common.name} *</Label>
                    <Input
                      id="name"
                      placeholder="e.g. Anita Sharma"
                      value={patientData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">{t.common.age} *</Label>
                    <Input
                      id="age"
                      type="number"
                      min="18"
                      max="100"
                      placeholder="e.g. 34"
                      value={patientData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">{t.common.phone}</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        className="pl-10"
                        placeholder="10-digit mobile number"
                        value={patientData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Patient Email (for portal access) *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="patient@example.com"
                      value={patientData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Account Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Min. 6 characters"
                      value={patientData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      minLength={6}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address / Village</Label>
                    <Input
                      id="address"
                      value={patientData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Village Name, Taluka, District"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-md font-medium">{t.ashaWorker.medicalInfo}</h4>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="symptoms">{t.admin.symptoms}</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowVoiceRecorder(!showVoiceRecorder)}
                        className="flex items-center gap-2 bg-transparent"
                      >
                        <Mic className="h-4 w-4" />
                        {showVoiceRecorder ? t.ashaWorker.hideVoiceRecording : t.ashaWorker.useVoiceRecording}
                      </Button>
                    </div>

                    {showVoiceRecorder && (
                      <VoiceRecorder
                        onTranscriptChange={handleVoiceTranscriptChange}
                        currentTranscript={patientData.symptoms}
                        className="mb-4"
                      />
                    )}

                    <Textarea
                      id="symptoms"
                      placeholder="Record reported symptoms or concerns..."
                      value={patientData.symptoms}
                      onChange={(e) => handleInputChange("symptoms", e.target.value)}
                      className="min-h-20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medicalHistory">Medical History</Label>
                    <Textarea
                      id="medicalHistory"
                      placeholder="Previous screenings, conditions, family history..."
                      value={patientData.medicalHistory}
                      onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Connect to Screening Point */}
            <div className="space-y-3 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800">
              <h4 className="font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                📍 Step 2: Screening Referral Point
              </h4>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                Upon registration, the patient will be referred to a trained clinician at the nearest Primary Health Centre (PHC) or Mobile Screening Van for clinical examination & portable device imaging.
              </p>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3">
                {isSubmitting ? "Registering..." : "Register Patient & Refer for Screening"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-teal-700">
              <CheckCircle2 className="h-5 w-5 text-teal-600" />
              Registration & Referral Complete
            </DialogTitle>
            <DialogDescription>
              The patient has been registered and connected to the clinical screening network.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-teal-50 dark:bg-teal-900/30 rounded-lg">
              <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold uppercase">Assigned Patient ID</p>
              <p className="text-lg font-bold font-mono text-teal-900 dark:text-teal-100">{successPatientId || "-"}</p>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              A trained clinician will perform screening using a portable imaging device at the designated screening point.
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowSuccess(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

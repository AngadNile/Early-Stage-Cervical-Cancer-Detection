"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import FileUpload from "@/components/ui/file-upload"
import VoiceRecorder from "@/components/ui/voice-recorder"
import { UserPlus, Mic } from "lucide-react"

export default function AddPatientForm() {
  const [patientData, setPatientData] = useState({
    name: "",
    age: "",
    gender: "",
    village: "",
    city: "",
    symptoms: "",
  })
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [aiResult, setAiResult] = useState<"normal" | "abnormal" | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string) => {
    setPatientData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFileSelect = (file: File, preview: string) => {
    setUploadedImage(preview)
    // Simulate AI analysis with random result
    const randomResult = Math.random() > 0.5 ? "normal" : "abnormal"
    setTimeout(() => {
      setAiResult(randomResult)
      toast({
        title: "AI Analysis Complete",
        description: `Result: ${randomResult.toUpperCase()}`,
        variant: randomResult === "normal" ? "default" : "destructive",
      })
    }, 2000)
  }

  const handleFileRemove = () => {
    setUploadedImage(null)
    setAiResult(null)
  }

  const handleVoiceTranscriptChange = (transcript: string) => {
    setPatientData((prev) => ({
      ...prev,
      symptoms: transcript,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Patient added successfully",
        description: `${patientData.name} has been added to the system with ${aiResult} result.`,
      })

      // Reset form
      setPatientData({
        name: "",
        age: "",
        gender: "",
        village: "",
        city: "",
        symptoms: "",
      })
      setUploadedImage(null)
      setAiResult(null)
      setShowVoiceRecorder(false)
      setIsSubmitting(false)
    }, 1000)
  }

  const generateCredentials = () => {
    const username = `patient_${Math.random().toString(36).substr(2, 6)}`
    const password = Math.random().toString(36).substr(2, 8)

    toast({
      title: "Patient Credentials Generated",
      description: `Username: ${username}, Password: ${password}`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Add New Patient
        </CardTitle>
        <CardDescription>Register a new patient and conduct cancer screening</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Patient Name</Label>
              <Input
                id="name"
                value={patientData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={patientData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={patientData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="village">Village</Label>
              <Input
                id="village"
                value={patientData.village}
                onChange={(e) => handleInputChange("village", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={patientData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="symptoms">Symptoms</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowVoiceRecorder(!showVoiceRecorder)}
                className="flex items-center gap-2 bg-transparent"
              >
                <Mic className="h-4 w-4" />
                {showVoiceRecorder ? "Hide" : "Use"} Voice Recording
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
              value={patientData.symptoms}
              onChange={(e) => handleInputChange("symptoms", e.target.value)}
              placeholder="Describe the patient's symptoms... You can also use voice recording above."
              rows={4}
            />
          </div>

          <div className="space-y-4">
            <Label>Upload Cervix Photo</Label>
            <FileUpload
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
              currentFile={uploadedImage}
              accept="image/*"
              maxSize={10}
            />

            {aiResult && (
              <div className="mt-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    aiResult === "normal" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  AI Result: {aiResult.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Adding Patient..." : "Add Patient"}
            </Button>
            <Button type="button" variant="outline" onClick={generateCredentials}>
              Generate Credentials
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

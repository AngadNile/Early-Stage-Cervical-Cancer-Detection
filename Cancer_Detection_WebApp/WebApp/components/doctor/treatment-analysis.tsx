"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { getCurrentUser } from "@/lib/auth"
import { assignmentService, cervixAnalysisService, patientService } from "@/lib/api-services"
import { Search, CheckCircle, AlertTriangle, ImageIcon, Loader2 } from "lucide-react"


export default function TreatmentAnalysis() {
  const { toast } = useToast()
  const doctor = getCurrentUser()
  const [lookupId, setLookupId] = useState("")
  const [loading, setLoading] = useState(false)
  const [patientDocId, setPatientDocId] = useState<string | null>(null)
  const [patientName, setPatientName] = useState<string>("")
  const [patientHumanId, setPatientHumanId] = useState<string>("")
  const [analysisId, setAnalysisId] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [riskLevel, setRiskLevel] = useState<"low" | "medium" | "high" | null>(null)
  const [aiResult, setAiResult] = useState<string | null>(null)
  const [aiSummary, setAiSummary] = useState<string>("")
  const [doctorFeedback, setDoctorFeedback] = useState("")
  const [nextSteps, setNextSteps] = useState("")

  const handleSearch = async () => {
    if (!doctor?.id) return
    if (!lookupId.trim()) {
      toast({ title: "Enter a Patient ID", description: "Please provide a valid Patient ID." })
      return
    }
    try {
      setLoading(true)
      // Find the patient doc by human-facing patientId
      const patient = await patientService.getByPatientId(lookupId.trim())
      if (!patient) {
        setPatientDocId(null)
        setAnalysisId(null)
        setImageUrl(null)
        setRiskLevel(null)
        setAiResult(null)
        setAiSummary("")
        toast({ title: "Not found", description: "No patient found with that Patient ID." })
        return
      }

      // Ensure this doctor is assigned to the patient
      const assigns = await assignmentService.getByDoctor(doctor.id)
      const isAssigned = assigns.some((a) => a.patientId === patient.id || a.patientId === patient.patientId)
      if (!isAssigned) {
        setPatientDocId(null)
        setAnalysisId(null)
        setImageUrl(null)
        setRiskLevel(null)
        setAiResult(null)
        setAiSummary("")
        toast({
          title: "Access denied",
          description: "You are not assigned to this patient. Images are hidden for privacy.",
        })
        return
      }

      // Load latest analysis for this patient
      const analyses = await cervixAnalysisService.getByPatient(patient.id!)
      const latest = analyses[0]

      setPatientDocId(patient.id!)
      setPatientName(patient.name)
      setPatientHumanId(patient.patientId)
      if (latest) {
        setAnalysisId(latest.id!)
        setImageUrl(latest.imageUrl ?? null)
        setRiskLevel(latest.riskLevel ?? null)
        setAiResult(latest.result || (latest.riskLevel === "high" ? "abnormal" : latest.riskLevel === "medium" ? "mild" : "normal"))
        setAiSummary(latest.analysis ?? "")
        // Prefill prior doctor feedback if exists
        setDoctorFeedback(latest.doctorFeedback || "")
        setNextSteps(latest.nextSteps || "")
      } else {
        setAnalysisId(null)
        setImageUrl(null)
        setRiskLevel(null)
        setAiResult(null)
        setAiSummary("")
      }
    } catch (e: any) {
      console.error("[v0] TreatmentAnalysis search error:", e)
      toast({ title: "Search failed", description: e?.message ? String(e.message) : "Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!doctor?.id || !patientDocId) {
      toast({ title: "Cannot save", description: "Search a valid patient and try again." })
      return
    }
    if (!doctorFeedback.trim() && !nextSteps.trim()) {
      toast({ title: "Add details", description: "Enter your analysis and/or treatment plan before publishing." })
      return
    }
    try {
      let targetAnalysisId = analysisId
      if (!targetAnalysisId) {
        // Create placeholder analysis if none exists
        const createdId = await cervixAnalysisService.create({
          patientId: patientDocId,
          imageUrl: "", // no image if none uploaded yet
          analysis: aiSummary || "Pending",
          riskLevel: (riskLevel as any) || "medium",
          ashaWorkerId: "", // unknown in this path
        })
        targetAnalysisId = createdId
        setAnalysisId(createdId)
      }

      await cervixAnalysisService.update(targetAnalysisId!, {
        doctorId: doctor.id,
        doctorFeedback: doctorFeedback.trim(),
        nextSteps: nextSteps.trim(),
        doctorReviewAt: new Date().toISOString(),
      })
      toast({ title: "Report saved", description: "Your analysis and treatment plan have been published." })
    } catch (e: any) {
      console.error("[v0] TreatmentAnalysis save error:", e)
      toast({ title: "Save failed", description: e?.message ? String(e.message) : "Please try again." })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Treatment / Analysis</CardTitle>
          <CardDescription>Enter a Patient ID to create or update your clinical report</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Label>Patient ID</Label>
              <Input
                placeholder="Enter Patient ID (e.g., PAT01234)"
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
              Search
            </Button>
          </div>

          {patientDocId && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Patient Details</CardTitle>
                  <CardDescription>Verify you’re assigned before proceeding</CardDescription>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <div>
                    <strong>Name:</strong> {patientName}
                  </div>
                  <div>
                    <strong>Patient ID:</strong> {patientHumanId}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">AI Analysis Snapshot</CardTitle>
                  <CardDescription>Only visible if you are assigned to this patient</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {imageUrl ? (
                    <img
                      src={imageUrl || "/placeholder.svg"}
                      alt="Cervix scan"
                      className="max-w-xs rounded-lg border"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ImageIcon className="h-4 w-4" />
                      No analysis image available yet.
                    </div>
                  )}

                  {aiResult && (
                    <div className="flex items-center gap-2">
                      {aiResult.toLowerCase() === "normal" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-sm font-medium capitalize">{aiResult}</span>
                    </div>
                  )}
                  {aiSummary && <p className="text-sm bg-gray-50 p-3 rounded">{aiSummary}</p>}
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">Doctor’s Assessment</CardTitle>
                  <CardDescription>Publish your professional analysis and treatment plan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label>Doctor Analysis</Label>
                    <Textarea
                      placeholder="Add your clinical assessment..."
                      value={doctorFeedback}
                      onChange={(e) => setDoctorFeedback(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Treatment Plan</Label>
                    <Textarea
                      placeholder="Tests, medications, follow-up plan..."
                      value={nextSteps}
                      onChange={(e) => setNextSteps(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <Button onClick={handleSave} disabled={!patientDocId}>
                    Save & Publish
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

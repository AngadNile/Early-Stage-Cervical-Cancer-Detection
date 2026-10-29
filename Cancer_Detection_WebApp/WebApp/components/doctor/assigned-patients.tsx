"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { getCurrentUser } from "@/lib/auth"
import { cervixAnalysisService, patientService, assignmentService } from "@/lib/api-services"
import { Search, Eye, Download, AlertTriangle, CheckCircle, Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"


// "result" is the AI label: "normal" | "mild" | "abnormal"
// "riskLevel" is a legacy field that defaults to "low" in DB – do NOT use it to determine the result
interface PatientWithAnalysis {
  id: string
  patientId: string
  name: string
  age: number
  address: string
  phone: string
  analysis: {
    id: string
    imageUrl: string
    analysis: string
    result: "normal" | "mild" | "abnormal" | string  // AI label – primary source of truth
    riskLevel: "low" | "medium" | "high"             // kept for legacy compat only
    confidence?: number                               // 0–100
    createdAt: any
  } | null
}

// Helper: derive Normal / Mild / Abnormal from the `result` field (never from riskLevel)
function getResultLabel(analysis: PatientWithAnalysis["analysis"]): {
  label: string
  isAbnormal: boolean
  isMild: boolean
} {
  if (!analysis) return { label: "—", isAbnormal: false, isMild: false }
  const r = (analysis.result ?? "").toLowerCase()
  if (r === "abnormal") return { label: "Abnormal", isAbnormal: true, isMild: false }
  if (r === "mild")     return { label: "Mild Abnormality", isAbnormal: true, isMild: true }
  if (r === "normal")   return { label: "Normal", isAbnormal: false, isMild: false }
  if (r === "high")     return { label: "Abnormal", isAbnormal: true, isMild: false }
  if (r === "medium")   return { label: "Mild Abnormality", isAbnormal: true, isMild: true }
  return { label: "Normal", isAbnormal: false, isMild: false }
}

function openPrintWindow(patient: PatientWithAnalysis, doctorName?: string) {
  if (!patient.analysis) return
  const { label, isAbnormal } = getResultLabel(patient.analysis)
  const confidence = patient.analysis.confidence !== undefined ? `${patient.analysis.confidence.toFixed(1)}%` : "N/A"
  const dateStr = patient.analysis.createdAt ? new Date(patient.analysis.createdAt).toLocaleString() : new Date().toLocaleString()
  const cColor = isAbnormal ? "#dc2626" : "#059669"
  const cBg = isAbnormal ? "#fef2f2" : "#ecfdf5"
  const cBorder = isAbnormal ? "#fca5a5" : "#6ee7b7"

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Cervical Screening Report – ${patient.name}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Segoe UI',Arial,sans-serif;color:#1e293b;background:#fff;padding:40px 48px;max-width:760px;margin:0 auto}
    @media print{body{padding:24px 32px}}
  </style>
</head>
<body>
  <div style="display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:20px;border-bottom:2px solid #0d9488;margin-bottom:28px;">
    <div>
      <div style="font-size:22px;font-weight:700;color:#0d9488;letter-spacing:-.3px;">🩺 CervixCare AI</div>
      <div style="font-size:13px;color:#64748b;margin-top:4px;">Medical Assessment & Cervical Screening Report</div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:11px;color:#64748b;">Report Date</div>
      <div style="font-size:12px;font-weight:600;color:#1e293b;">${dateStr}</div>
      <div style="margin-top:6px;font-size:10px;color:#64748b;background:#f1f5f9;padding:3px 8px;border-radius:12px;">
        CONFIDENTIAL — For Medical Use Only
      </div>
    </div>
  </div>

  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:18px 22px;margin-bottom:24px;display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:13px;">
    <div><strong>Patient Name:</strong> ${patient.name}</div>
    <div><strong>Patient ID:</strong> ${patient.patientId}</div>
    <div><strong>Age:</strong> ${patient.age}</div>
    <div><strong>Phone:</strong> ${patient.phone}</div>
    <div style="grid-column:span 2;"><strong>Address:</strong> ${patient.address}</div>
    ${doctorName ? `<div style="grid-column:span 2;"><strong>Attending Doctor:</strong> ${doctorName}</div>` : ""}
  </div>

  <div style="background:${cBg};border:2px solid ${cBorder};border-radius:12px;padding:22px 26px;margin-bottom:24px;">
    <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.8px;margin-bottom:8px;">AI Screening Result</div>
    <div style="display:flex;align-items:center;justify-content:space-between;">
      <div style="font-size:26px;font-weight:800;color:${cColor};">${label}</div>
      <div style="text-align:right;">
        <div style="font-size:11px;color:#64748b;">AI Confidence</div>
        <div style="font-size:22px;font-weight:700;color:${cColor};">${confidence}</div>
      </div>
    </div>
  </div>

  ${patient.analysis.imageUrl ? `
  <div style="margin-bottom:24px;">
    <div style="font-size:12px;font-weight:700;color:#1e293b;margin-bottom:8px;">Cervix Image Scan</div>
    <img src="${patient.analysis.imageUrl}" alt="Scan" style="max-height:220px;border-radius:8px;border:1px solid #e2e8f0;" />
  </div>` : ""}

  <div style="margin-bottom:24px;">
    <div style="font-size:13px;font-weight:700;color:#1e293b;margin-bottom:8px;border-bottom:1px solid #e2e8f0;padding-bottom:4px;">Analysis Details</div>
    <div style="font-size:13px;color:#334155;line-height:1.6;background:#f8fafc;padding:12px;border-radius:8px;">${patient.analysis.analysis || "Screening complete."}</div>
  </div>

  <div style="border-top:1px solid #e2e8f0;padding-top:14px;display:flex;justify-content:space-between;font-size:10px;color:#94a3b8;">
    <span>CervixCare AI System</span>
    <span>Patient ID: ${patient.patientId} · ${dateStr}</span>
  </div>

  <script>window.onload = function(){ window.print(); }<\/script>
</body>
</html>`

  const win = window.open("", "_blank", "width=820,height=900")
  if (win) {
    win.document.write(html)
    win.document.close()
  }
}

export default function AssignedPatients() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<PatientWithAnalysis | null>(null)
  const [patients, setPatients] = useState<PatientWithAnalysis[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const user = getCurrentUser()

  useEffect(() => {
    const loadPatients = async () => {
      if (!user?.id) return
      try {
        setLoading(true)
        const assigns = await assignmentService.getByDoctor(user.id)
        const patientsWithAnalysis: PatientWithAnalysis[] = []

        for (const a of assigns) {
          const patient = await patientService.getById(a.patientId)
          if (!patient) continue

          const analyses = await cervixAnalysisService.getByPatient(a.patientId)
          const latest = analyses[0]

          patientsWithAnalysis.push({
            id: patient.id!,
            patientId: patient.patientId,
            name: patient.name,
            age: patient.age,
            address: patient.address,
            phone: patient.phone,
            analysis: latest
              ? {
                  id: latest.id!,
                  imageUrl: latest.imageUrl ?? "",
                  analysis: latest.analysis ?? "",
                  result: latest.result ?? "",          // ← AI label (primary source)
                  riskLevel: latest.riskLevel ?? "low", // ← legacy fallback
                  confidence: latest.confidence,         // ← 0–100
                  createdAt: latest.createdAt,
                }
              : null,
          })
        }
        setPatients(patientsWithAnalysis)
      } catch (error) {
        console.error("[v0] Error loading patients:", error)
        toast({
          title: "Unable to load patients",
          description: "Please check your connection and try again.",
        })
      } finally {
        setLoading(false)
      }
    }
    loadPatients()
  }, [user?.id, toast])

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDownloadReport = (patient: PatientWithAnalysis) => {
    if (!patient.analysis) {
      toast({
        title: "No Report Available",
        description: "This patient does not have a screening analysis yet.",
        variant: "destructive",
      })
      return
    }
    openPrintWindow(patient, user?.name)
    toast({
      title: "Opening Report",
      description: `Opening report window for ${patient.name}...`,
    })
  }

  const handleContactAasha = (patient: PatientWithAnalysis) => {
    toast({
      title: "Contacting Aasha Worker",
      description: `Initiating contact regarding ${patient.name}'s case.`,
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading patients...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Assigned Patients
          </CardTitle>
          <CardDescription>View and manage patients assigned to you by Aasha Workers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search patients by name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {filteredPatients.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No patients assigned yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient ID</TableHead> {/* new column */}
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-mono text-xs">{patient.patientId}</TableCell> {/* show patientId */}
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.address}</TableCell>
                    <TableCell>
                      {patient.analysis ? (() => {
                        const { label, isAbnormal } = getResultLabel(patient.analysis)
                        return (
                          <Badge
                            variant={isAbnormal ? "destructive" : "default"}
                            className="flex items-center gap-1 w-fit"
                          >
                            {isAbnormal ? (
                              <AlertTriangle className="h-3 w-3" />
                            ) : (
                              <CheckCircle className="h-3 w-3" />
                            )}
                            {label}
                          </Badge>
                        )
                      })() : (
                        <Badge variant="secondary" className="w-fit">
                          No analysis yet
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {patient.analysis ? new Date(patient.analysis.createdAt).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => setSelectedPatient(patient)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6">
                            <DialogHeader>
                              <DialogTitle className="text-xl font-bold">Patient Details - {patient.name}</DialogTitle>
                              <DialogDescription>
                                Detailed view of patient information{patient.analysis ? " and AI analysis" : ""}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedPatient && (
                              <div className="space-y-6 pt-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border">
                                    <h4 className="font-semibold text-sm mb-3 text-slate-700 dark:text-slate-300">Patient Information</h4>
                                    <div className="space-y-2 text-sm">
                                      <p>
                                        <strong className="text-slate-600 dark:text-slate-400">Patient ID:</strong>{" "}
                                        <span className="font-mono bg-white dark:bg-slate-800 px-2 py-0.5 rounded border text-xs">{selectedPatient.patientId}</span>
                                      </p>
                                      <p>
                                        <strong className="text-slate-600 dark:text-slate-400">Name:</strong> {selectedPatient.name}
                                      </p>
                                      <p>
                                        <strong className="text-slate-600 dark:text-slate-400">Age:</strong> {selectedPatient.age}
                                      </p>
                                      <p>
                                        <strong className="text-slate-600 dark:text-slate-400">Address:</strong> {selectedPatient.address}
                                      </p>
                                      <p>
                                        <strong className="text-slate-600 dark:text-slate-400">Phone:</strong> {selectedPatient.phone}
                                      </p>
                                      {selectedPatient.analysis && (
                                        <p>
                                          <strong className="text-slate-600 dark:text-slate-400">Date:</strong>{" "}
                                          {new Date(selectedPatient.analysis.createdAt).toLocaleDateString()}
                                        </p>
                                      )}
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="mt-3 text-xs"
                                      onClick={() => {
                                        navigator.clipboard.writeText(selectedPatient.patientId)
                                        toast({ title: "Copied!", description: "Patient ID copied to clipboard." })
                                      }}
                                    >
                                      Copy Patient ID
                                    </Button>
                                  </div>

                                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border">
                                    <h4 className="font-semibold text-sm mb-3 text-slate-700 dark:text-slate-300">Analysis Result</h4>
                                    {selectedPatient.analysis ? (() => {
                                      const { label, isAbnormal } = getResultLabel(selectedPatient.analysis)
                                      return (
                                        <div className="space-y-3">
                                          <div className="flex items-center gap-3 flex-wrap">
                                            <Badge
                                              variant={isAbnormal ? "destructive" : "default"}
                                              className="flex items-center gap-1.5 px-3 py-1 text-sm font-medium"
                                            >
                                              {isAbnormal ? (
                                                <AlertTriangle className="h-4 w-4" />
                                              ) : (
                                                <CheckCircle className="h-4 w-4" />
                                              )}
                                              {label}
                                            </Badge>
                                            {selectedPatient.analysis.confidence !== undefined && (
                                              <span className="text-xs text-muted-foreground font-semibold bg-white dark:bg-slate-800 px-2 py-1 rounded border">
                                                {selectedPatient.analysis.confidence.toFixed(1)}% confidence
                                              </span>
                                            )}
                                          </div>
                                          {isAbnormal ? (
                                            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg">
                                              <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                                                ⚠️ Requires immediate medical attention and follow-up.
                                              </p>
                                            </div>
                                          ) : (
                                            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-lg">
                                              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                                ✓ Screening results indicate normal findings. Routine follow-up recommended.
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      )
                                    })() : (
                                      <p className="text-sm text-muted-foreground">No analysis uploaded yet.</p>
                                    )}
                                  </div>
                                </div>

                                {selectedPatient.analysis && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                    <div>
                                      <h4 className="font-semibold text-sm mb-2">Analysis Details</h4>
                                      <p className="text-sm bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border text-slate-700 dark:text-slate-300 min-h-[100px]">
                                        {selectedPatient.analysis.analysis || "Screening completed."}
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-sm mb-2">Uploaded Scan Image</h4>
                                      {selectedPatient.analysis.imageUrl ? (
                                        <img
                                          src={selectedPatient.analysis.imageUrl}
                                          alt="Medical scan"
                                          className="max-h-52 w-full object-cover rounded-lg border"
                                        />
                                      ) : (
                                        <div className="h-40 border rounded-lg flex items-center justify-center text-muted-foreground text-sm bg-slate-50">
                                          No image scan available
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Feedback form appears only when there is an analysis to review */}
                                {selectedPatient.analysis && (
                                  <div className="pt-2 border-t">
                                    <h4 className="font-semibold text-sm mb-3">Doctor Feedback & Next Steps</h4>
                                    <div className="space-y-4">
                                      <div>
                                        <Label htmlFor="doctorFeedback" className="text-xs font-semibold">Feedback</Label>
                                        <Textarea
                                          id="doctorFeedback"
                                          rows={3}
                                          placeholder="Add your clinical assessment..."
                                          className="mt-1 text-sm"
                                          onChange={(e) => ((selectedPatient as any)._feedback = e.target.value)}
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="nextSteps" className="text-xs font-semibold">Next Steps</Label>
                                        <Textarea
                                          id="nextSteps"
                                          rows={3}
                                          placeholder="Tests, medications, referral plan..."
                                          className="mt-1 text-sm"
                                          onChange={(e) => ((selectedPatient as any)._nextSteps = e.target.value)}
                                        />
                                      </div>
                                    </div>
                                    <div className="flex gap-2 pt-3">
                                      <Button
                                        size="sm"
                                        onClick={async () => {
                                          try {
                                            await cervixAnalysisService.update(selectedPatient.analysis!.id, {
                                              doctorId: user!.id,
                                              doctorFeedback: (selectedPatient as any)._feedback || "",
                                              nextSteps: (selectedPatient as any)._nextSteps || "",
                                              doctorReviewAt: new Date().toISOString(),
                                            })
                                            toast({
                                              title: "Report published",
                                              description:
                                                "Your feedback is saved and visible to patient and ASHA worker.",
                                            })
                                          } catch (e: any) {
                                            toast({
                                              title: "Save failed",
                                              description: e?.message
                                                ? String(e.message)
                                                : "Unable to save feedback right now.",
                                            })
                                          }
                                        }}
                                      >
                                        Save & Publish Assessment
                                      </Button>
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-center gap-3 pt-4 border-t">
                                  {selectedPatient.analysis ? (
                                    <Button onClick={() => handleDownloadReport(selectedPatient)}>
                                      <Download className="h-4 w-4 mr-2" />
                                      Print / Download Report
                                    </Button>
                                  ) : (
                                    <Button variant="outline" disabled title="No report available yet">
                                      <Download className="h-4 w-4 mr-2" />
                                      Download Report
                                    </Button>
                                  )}
                                  {selectedPatient.analysis && getResultLabel(selectedPatient.analysis).isAbnormal && (
                                    <Button variant="outline" onClick={() => handleContactAasha(selectedPatient)}>
                                      Contact Aasha Worker
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadReport(patient)}
                          disabled={!patient.analysis}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Normal Cases Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              <li>• Schedule routine follow-up in 6 months</li>
              <li>• Advise regular self-examination</li>
              <li>• Maintain healthy lifestyle habits</li>
              <li>• Continue regular screening schedule</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Abnormal Cases Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              <li>• Immediate referral for further testing</li>
              <li>• Contact Aasha Worker for coordination</li>
              <li>• Schedule urgent follow-up appointment</li>
              <li>• Provide patient counseling and support</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

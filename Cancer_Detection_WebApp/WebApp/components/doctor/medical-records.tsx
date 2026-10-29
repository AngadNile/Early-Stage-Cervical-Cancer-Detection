"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { getCurrentUser } from "@/lib/auth"
import { cervixAnalysisService, patientService, assignmentService } from "@/lib/api-services"
import {
  FolderOpen, Search, Plus, FileText, Calendar, User,
  Printer, Edit, Loader2, CheckCircle2, AlertTriangle, XCircle,
} from "lucide-react"

type RiskLevel = "normal" | "mild" | "abnormal"

interface MedicalRecord {
  id: string
  patientName: string
  patientId: string
  date: string
  type: string
  diagnosis: string
  treatment: string
  notes: string
  status: "active" | "completed" | "follow-up"
  // AI result fields
  aiResult: RiskLevel
  confidence: number
  recommendations: string[]
  imageUrl?: string
}

const RESULT_LABEL: Record<RiskLevel, string> = { normal: "Normal", mild: "Mild Abnormality", abnormal: "Abnormal" }
const RESULT_COLOR: Record<RiskLevel, string> = { normal: "#059669", mild: "#d97706", abnormal: "#dc2626" }
const RESULT_BG: Record<RiskLevel, string> = { normal: "#ecfdf5", mild: "#fffbeb", abnormal: "#fef2f2" }
const RESULT_BORDER: Record<RiskLevel, string> = { normal: "#6ee7b7", mild: "#fcd34d", abnormal: "#fca5a5" }

function ResultBadge({ level }: { level: RiskLevel }) {
  if (level === "normal") return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300 flex items-center gap-1 w-fit"><CheckCircle2 className="h-3 w-3" />Normal</Badge>
  if (level === "mild") return <Badge className="bg-amber-100 text-amber-700 border-amber-300 flex items-center gap-1 w-fit"><AlertTriangle className="h-3 w-3" />Mild Abnormality</Badge>
  return <Badge className="bg-red-100 text-red-700 border-red-300 flex items-center gap-1 w-fit"><XCircle className="h-3 w-3" />Abnormal</Badge>
}

function openPrintWindow(rec: MedicalRecord, doctorName: string) {
  const lvl = rec.aiResult
  const tc = RESULT_COLOR[lvl], tb = RESULT_BG[lvl], tbd = RESULT_BORDER[lvl]
  const rows = rec.recommendations.map((r, i) =>
    `<tr><td style="padding:8px 12px;font-size:13px;color:#334155;border-bottom:1px solid #f1f5f9;"><span style="color:#0d9488;font-weight:700;margin-right:8px;">${i+1}.</span>${r}</td></tr>`).join("")
  const imgBlock = rec.imageUrl
    ? `<div style="margin-bottom:24px;"><div style="font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px;">Cervix Image</div><img src="${rec.imageUrl}" style="max-height:200px;max-width:100%;border-radius:10px;border:1px solid #e2e8f0;object-fit:contain;"/></div>` : ""
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><title>Report-${rec.patientId}</title>
  <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',Arial,sans-serif;color:#1e293b;background:#fff;padding:40px 48px;max-width:760px;margin:0 auto}@media print{body{padding:24px 32px}}</style></head><body>
  <div style="display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:20px;border-bottom:2px solid #0d9488;margin-bottom:28px;"><div><div style="font-size:22px;font-weight:700;color:#0d9488;">CervixCare AI</div><div style="font-size:13px;color:#64748b;margin-top:4px;">Cervical Cancer Screening Report</div><div style="font-size:11px;color:#94a3b8;margin-top:2px;">Doctor Portal</div></div><div style="text-align:right;"><div style="font-size:11px;color:#64748b;">Report Date</div><div style="font-size:12px;font-weight:600;">${rec.date}</div><div style="margin-top:8px;font-size:11px;color:#64748b;background:#f1f5f9;padding:4px 10px;border-radius:20px;">CONFIDENTIAL</div></div></div>
  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:18px 22px;margin-bottom:24px;display:flex;gap:40px;flex-wrap:wrap;"><div><div style="font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:.8px;">Patient</div><div style="font-size:18px;font-weight:700;">${rec.patientName}</div><div style="font-size:12px;color:#64748b;">ID: ${rec.patientId}</div></div><div><div style="font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:.8px;">Reviewing Doctor</div><div style="font-size:14px;font-weight:600;">${doctorName}</div></div><div><div style="font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:.8px;">Date</div><div style="font-size:13px;font-weight:500;">${rec.date}</div></div></div>
  <div style="background:${tb};border:2px solid ${tbd};border-radius:12px;padding:22px 26px;margin-bottom:24px;"><div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.8px;margin-bottom:8px;">AI Analysis Result</div><div style="display:flex;align-items:center;gap:16px;"><div style="font-size:28px;font-weight:800;color:${tc};">${RESULT_LABEL[lvl]}</div><div style="margin-left:auto;text-align:right;"><div style="font-size:11px;color:#64748b;">AI Confidence</div><div style="font-size:24px;font-weight:700;color:${tc};">${rec.confidence.toFixed(1)}%</div></div></div><div style="margin-top:14px;height:8px;background:#e2e8f0;border-radius:99px;overflow:hidden;"><div style="height:100%;width:${rec.confidence}%;background:${tc};border-radius:99px;"></div></div></div>
  ${imgBlock}
  <div style="margin-bottom:28px;"><div style="font-size:13px;font-weight:700;color:#1e293b;margin-bottom:12px;padding-bottom:6px;border-bottom:1px solid #e2e8f0;">Clinical Recommendations</div><table style="width:100%;border-collapse:collapse;"><tbody>${rows}</tbody></table></div>
  ${rec.diagnosis ? `<div style="margin-bottom:24px;"><div style="font-size:13px;font-weight:700;margin-bottom:8px;">Doctor Diagnosis</div><p style="font-size:13px;background:#f8fafc;padding:12px;border-radius:8px;">${rec.diagnosis}</p></div>` : ""}
  ${rec.notes ? `<div style="margin-bottom:24px;"><div style="font-size:13px;font-weight:700;margin-bottom:8px;">Clinical Notes</div><p style="font-size:13px;background:#f8fafc;padding:12px;border-radius:8px;">${rec.notes}</p></div>` : ""}
  <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:12px 16px;font-size:11px;color:#78350f;margin-bottom:28px;line-height:1.6;">Important: AI-assisted screening report. Clinical judgment must take precedence.</div>
  <div style="border-top:1px solid #e2e8f0;padding-top:14px;display:flex;justify-content:space-between;font-size:10px;color:#94a3b8;"><span>CervixCare AI</span><span>Patient: ${rec.patientId} - ${rec.date}</span></div>
  <script>window.onload=function(){window.print();}<\/script></body></html>`
  const win = window.open("", "_blank", "width=820,height=900")
  if (win) { win.document.write(html); win.document.close() }
}

export default function MedicalRecords() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const user = getCurrentUser()

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return
      try {
        setLoading(true)
        const assigns = await assignmentService.getByDoctor(user.id)
        const result: MedicalRecord[] = []
        for (const a of assigns) {
          const latest = (await cervixAnalysisService.getByPatient(a.patientId))[0]
          if (!latest) continue
          const patient = await patientService.getById(a.patientId)
          if (!patient) continue

          const raw = (latest.result ?? "").toLowerCase()
          const aiResult: RiskLevel = raw === "abnormal" ? "abnormal" : raw === "mild" ? "mild" : raw === "normal" ? "normal"
            : (latest.riskLevel === "high" ? "abnormal" : latest.riskLevel === "medium" ? "mild" : "normal")
          const confidence = latest.confidence ?? 0
          const recs = Array.isArray(latest.recommendations) && latest.recommendations.length
            ? (latest.recommendations as string[])
            : (aiResult === "abnormal" ? ["Immediate colposcopy required", "Urgent referral to specialist", "Biopsy may be needed"]
              : aiResult === "mild" ? ["Follow-up colposcopy recommended", "Repeat screening in 6-12 months"]
              : ["Routine follow-up in 3 years"])

          result.push({
            id: latest.id!,
            patientName: patient.name,
            patientId: patient.patientId,
            date: new Date(latest.createdAt).toLocaleDateString(),
            type: "Cervical Cancer Screening",
            diagnosis: latest.doctorFeedback ?? latest.analysis ?? "",
            treatment: aiResult === "normal" ? "Routine follow-up recommended"
              : aiResult === "mild" ? "Additional testing required"
              : "Immediate medical attention needed",
            notes: `AI Result: ${RESULT_LABEL[aiResult]} (${confidence.toFixed(1)}% confidence)`,
            status: aiResult === "normal" ? "completed" : aiResult === "mild" ? "follow-up" : "active",
            aiResult,
            confidence,
            recommendations: recs,
            imageUrl: latest.imageUrl || undefined,
          })
        }
        setRecords(result)
      } catch (err) {
        console.error("[MedicalRecords]", err)
        toast({ title: "Unable to load records", description: "Please refresh and try again." })
      } finally { setLoading(false) }
    }
    load()
  }, [user?.id])

  const filtered = records.filter((r) =>
    r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSaveRecord = async () => {
    if (!selectedRecord) return
    try {
      await cervixAnalysisService.update(selectedRecord.id, {
        doctorId: user!.id,
        doctorFeedback: `Diagnosis: ${selectedRecord.diagnosis}\nTreatment: ${selectedRecord.treatment}\nNotes: ${selectedRecord.notes}`,
        doctorReviewAt: new Date().toISOString(),
      })
      toast({ title: "Record updated", description: "Medical record saved successfully." })
      setIsEditing(false)
    } catch (e: any) {
      toast({ title: "Save failed", description: e?.message ?? "Unable to save record right now." })
    }
  }

  const getStatusColor = (s: string) =>
    s === "active" ? "bg-blue-100 text-blue-800" : s === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"

  if (loading) return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin" /><span className="ml-2">Loading medical records...</span>
    </div>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FolderOpen className="h-5 w-5" />Medical Records Management</CardTitle>
          <CardDescription>Patient screening records with AI analysis results</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="records" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="records" className="flex items-center gap-2"><FileText className="h-4 w-4" />Patient Records</TabsTrigger>
              <TabsTrigger value="create" className="flex items-center gap-2"><Plus className="h-4 w-4" />Create Record</TabsTrigger>
            </TabsList>

            <TabsContent value="records" className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Search by patient name, ID, or diagnosis..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: list */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Patient Records</h3>
                  {filtered.length === 0 ? (
                    <div className="text-center py-8 text-gray-500"><FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" /><p>No medical records found</p></div>
                  ) : (
                    filtered.map((rec) => (
                      <Card key={rec.id} className={`cursor-pointer transition-all hover:shadow-md ${selectedRecord?.id === rec.id ? "ring-2 ring-teal-500" : "hover:bg-gray-50 dark:hover:bg-slate-800/50"}`} onClick={() => setSelectedRecord(rec)}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div><h4 className="font-semibold">{rec.patientName}</h4><p className="text-sm text-gray-600">ID: {rec.patientId}</p></div>
                            <Badge className={getStatusColor(rec.status)}>{rec.status}</Badge>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-gray-400" /><span>{rec.date}</span></div>
                            <ResultBadge level={rec.aiResult} />
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-20 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${rec.aiResult === "normal" ? "bg-emerald-500" : rec.aiResult === "mild" ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${rec.confidence}%` }} />
                              </div>
                              <span className="text-xs text-muted-foreground">{rec.confidence.toFixed(1)}%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>

                {/* Right: detail */}
                <div className="space-y-4">
                  {selectedRecord ? (
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />{selectedRecord.patientName}</CardTitle>
                            <CardDescription>ID: {selectedRecord.patientId}</CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => setIsEditing(!isEditing)}><Edit className="h-4 w-4 mr-1" />{isEditing ? "Cancel" : "Edit"}</Button>
                            <Button size="sm" variant="outline" onClick={() => openPrintWindow(selectedRecord, user?.name ?? "Doctor")}><Printer className="h-4 w-4 mr-1" />Print</Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* AI result banner */}
                        <div className="rounded-xl p-4" style={{ background: RESULT_BG[selectedRecord.aiResult], border: `2px solid ${RESULT_BORDER[selectedRecord.aiResult]}` }}>
                          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">AI Analysis Result</div>
                          <div className="flex items-center justify-between">
                            <div className="text-xl font-bold" style={{ color: RESULT_COLOR[selectedRecord.aiResult] }}>{RESULT_LABEL[selectedRecord.aiResult]}</div>
                            <div className="text-right"><div className="text-xs text-gray-500">Confidence</div><div className="text-lg font-bold" style={{ color: RESULT_COLOR[selectedRecord.aiResult] }}>{selectedRecord.confidence.toFixed(1)}%</div></div>
                          </div>
                          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${selectedRecord.confidence}%`, background: RESULT_COLOR[selectedRecord.aiResult] }} />
                          </div>
                        </div>

                        {/* Recommendations */}
                        <div>
                          <Label className="font-semibold text-sm">AI Recommendations</Label>
                          <ul className="mt-1 space-y-1">
                            {selectedRecord.recommendations.map((r, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><span className="text-teal-500 font-bold">{i+1}.</span>{r}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Image */}
                        {selectedRecord.imageUrl && (
                          <div><Label className="font-semibold text-sm">Cervix Image</Label><img src={selectedRecord.imageUrl} alt="Cervix scan" className="mt-2 max-w-full rounded-lg border" /></div>
                        )}

                        {isEditing ? (
                          <div className="space-y-4">
                            <div className="space-y-2"><Label>Diagnosis</Label><Input defaultValue={selectedRecord.diagnosis} onChange={(e) => setSelectedRecord({ ...selectedRecord, diagnosis: e.target.value })} /></div>
                            <div className="space-y-2"><Label>Treatment</Label><Textarea defaultValue={selectedRecord.treatment} rows={3} onChange={(e) => setSelectedRecord({ ...selectedRecord, treatment: e.target.value })} /></div>
                            <div className="space-y-2"><Label>Clinical Notes</Label><Textarea defaultValue={selectedRecord.notes} rows={4} onChange={(e) => setSelectedRecord({ ...selectedRecord, notes: e.target.value })} /></div>
                            <Button onClick={handleSaveRecord} className="w-full">Save Changes</Button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div><Label className="font-semibold">Date:</Label><p>{selectedRecord.date}</p></div>
                            <div><Label className="font-semibold">Type:</Label><p>{selectedRecord.type}</p></div>
                            {selectedRecord.diagnosis && <div><Label className="font-semibold">Diagnosis:</Label><p>{selectedRecord.diagnosis}</p></div>}
                            <div><Label className="font-semibold">Treatment:</Label><p>{selectedRecord.treatment}</p></div>
                            <div><Label className="font-semibold">Status:</Label><Badge className={getStatusColor(selectedRecord.status)}>{selectedRecord.status}</Badge></div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <Card><CardContent className="p-8 text-center text-gray-500"><FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" /><p>Select a record to view details</p></CardContent></Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="create" className="space-y-4">
              <Card>
                <CardHeader><CardTitle>Create New Medical Record</CardTitle><CardDescription>Add a new medical record for a patient</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Patient Name</Label><Input placeholder="Enter patient name" /></div>
                    <div className="space-y-2"><Label>Patient ID</Label><Input placeholder="Enter patient ID" /></div>
                    <div className="space-y-2"><Label>Record Type</Label><Input placeholder="e.g., Cervical Cancer Screening" /></div>
                    <div className="space-y-2"><Label>Date</Label><Input type="date" /></div>
                  </div>
                  <div className="space-y-2"><Label>Diagnosis</Label><Input placeholder="Enter diagnosis" /></div>
                  <div className="space-y-2"><Label>Treatment Plan</Label><Textarea placeholder="Enter treatment plan and recommendations" rows={3} /></div>
                  <div className="space-y-2"><Label>Clinical Notes</Label><Textarea placeholder="Enter detailed clinical notes" rows={4} /></div>
                  <Button className="w-full"><Plus className="h-4 w-4 mr-2" />Create Medical Record</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
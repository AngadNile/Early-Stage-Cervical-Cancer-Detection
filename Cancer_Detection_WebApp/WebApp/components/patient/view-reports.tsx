"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { getCurrentUser } from "@/lib/auth"
import { cervixAnalysisService, doctorService, patientService } from "@/lib/api-services"
import {
  FileText, Eye, Printer, Search, Calendar, CheckCircle, AlertTriangle, XCircle,
  UserCheck, Shield, Loader2, FlaskConical,
} from "lucide-react"

type RiskLevel = "normal" | "mild" | "abnormal"

interface ReportData {
  id: string; date: string; type: string; patientId: string
  aiResult: RiskLevel; confidence: number; recommendations: string[]
  doctor: string; notes: string; imageUrl?: string
  doctorReviewed: boolean; reviewDate: string; treatmentPlan?: string
}

const RESULT_LABEL: Record<RiskLevel, string> = { normal: "Normal", mild: "Mild Abnormality", abnormal: "Abnormal" }
const RESULT_COLOR: Record<RiskLevel, string> = { normal: "#059669", mild: "#d97706", abnormal: "#dc2626" }
const RESULT_BG: Record<RiskLevel, string> = { normal: "#ecfdf5", mild: "#fffbeb", abnormal: "#fef2f2" }
const RESULT_BORDER: Record<RiskLevel, string> = { normal: "#6ee7b7", mild: "#fcd34d", abnormal: "#fca5a5" }
const DEFAULT_RECS: Record<RiskLevel, string[]> = {
  normal: ["Routine follow-up in 3 years", "Continue regular screenings as scheduled"],
  mild: ["Follow-up colposcopy recommended", "Repeat screening in 6-12 months", "Refer to gynecologist"],
  abnormal: ["Immediate colposcopy required", "Urgent referral to specialist", "Biopsy may be needed"],
}

function openPrintWindow(report: ReportData, pName: string) {
  const lvl = report.aiResult
  const tc = RESULT_COLOR[lvl], tb = RESULT_BG[lvl], tbd = RESULT_BORDER[lvl]
  const rows = report.recommendations.map((r, i) =>
    `<tr><td style="padding:8px 12px;font-size:13px;color:#334155;border-bottom:1px solid #f1f5f9;"><span style="color:#0d9488;font-weight:700;margin-right:8px;">${i+1}.</span>${r}</td></tr>`).join("")
  const imgBlock = report.imageUrl
    ? `<div style="margin-bottom:24px;"><div style="font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px;">Cervix Image</div><img src="${report.imageUrl}" style="max-height:200px;max-width:100%;border-radius:10px;border:1px solid #e2e8f0;object-fit:contain;"/></div>` : ""
  const notesBlock = report.notes
    ? `<div style="margin-bottom:24px;"><div style="font-size:13px;font-weight:700;margin-bottom:8px;">${report.doctorReviewed ? "Doctor Assessment" : "Screening Notes"}</div><p style="font-size:13px;background:#f8fafc;padding:12px;border-radius:8px;">${report.notes}</p></div>` : ""
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><title>Report-${report.patientId}</title>
  <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',Arial,sans-serif;color:#1e293b;background:#fff;padding:40px 48px;max-width:760px;margin:0 auto}@media print{body{padding:24px 32px}}</style></head><body>
  <div style="display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:20px;border-bottom:2px solid #0d9488;margin-bottom:28px;"><div><div style="font-size:22px;font-weight:700;color:#0d9488;">CervixCare AI</div><div style="font-size:13px;color:#64748b;margin-top:4px;">Cervical Cancer Screening Report</div></div><div style="text-align:right;"><div style="font-size:11px;color:#64748b;">Report Date</div><div style="font-size:12px;font-weight:600;">${report.date}</div><div style="margin-top:8px;font-size:11px;color:#64748b;background:#f1f5f9;padding:4px 10px;border-radius:20px;">CONFIDENTIAL</div></div></div>
  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:18px 22px;margin-bottom:24px;display:flex;gap:40px;flex-wrap:wrap;"><div><div style="font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:.8px;">Patient</div><div style="font-size:18px;font-weight:700;">${pName}</div><div style="font-size:12px;color:#64748b;">ID: ${report.patientId}</div></div><div><div style="font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:.8px;">Screened By</div><div style="font-size:14px;font-weight:600;">${report.doctor}</div></div><div><div style="font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:.8px;">Date</div><div style="font-size:13px;font-weight:500;">${report.date}</div></div></div>
  <div style="background:${tb};border:2px solid ${tbd};border-radius:12px;padding:22px 26px;margin-bottom:24px;"><div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.8px;margin-bottom:8px;">AI Analysis Result</div><div style="display:flex;align-items:center;gap:16px;"><div style="font-size:28px;font-weight:800;color:${tc};">${RESULT_LABEL[lvl]}</div><div style="margin-left:auto;text-align:right;"><div style="font-size:11px;color:#64748b;">Confidence</div><div style="font-size:24px;font-weight:700;color:${tc};">${report.confidence.toFixed(1)}%</div></div></div><div style="margin-top:14px;height:8px;background:#e2e8f0;border-radius:99px;overflow:hidden;"><div style="height:100%;width:${report.confidence}%;background:${tc};border-radius:99px;"></div></div></div>
  ${imgBlock}
  <div style="margin-bottom:28px;"><div style="font-size:13px;font-weight:700;color:#1e293b;margin-bottom:12px;padding-bottom:6px;border-bottom:1px solid #e2e8f0;">Clinical Recommendations</div><table style="width:100%;border-collapse:collapse;"><tbody>${rows}</tbody></table></div>
  ${notesBlock}
  <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:12px 16px;font-size:11px;color:#78350f;margin-bottom:28px;line-height:1.6;">Important: AI-assisted report. Consult a qualified healthcare professional before any treatment.</div>
  <div style="border-top:1px solid #e2e8f0;padding-top:14px;display:flex;justify-content:space-between;font-size:10px;color:#94a3b8;"><span>CervixCare AI</span><span>Patient: ${report.patientId} - ${report.date}</span></div>
  <script>window.onload=function(){window.print();}<\/script></body></html>`
  const win = window.open("", "_blank", "width=820,height=900")
  if (win) { win.document.write(html); win.document.close() }
}

function ResultBadge({ level }: { level: RiskLevel }) {
  if (level === "normal")
    return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300 flex items-center gap-1 w-fit"><CheckCircle className="h-3 w-3" />Normal</Badge>
  if (level === "mild")
    return <Badge className="bg-amber-100 text-amber-700 border-amber-300 flex items-center gap-1 w-fit"><AlertTriangle className="h-3 w-3" />Mild Abnormality</Badge>
  return <Badge className="bg-red-100 text-red-700 border-red-300 flex items-center gap-1 w-fit"><XCircle className="h-3 w-3" />Abnormal</Badge>
}

export default function ViewReports() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null)
  const [reports, setReports] = useState<ReportData[]>([])
  const [loading, setLoading] = useState(true)
  const [patientName, setPatientName] = useState("")
  const { toast } = useToast()
  const user = getCurrentUser()

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return
      try {
        setLoading(true)
        // Resolve custom patientId (e.g. PAT73342) — screening dashboard saves by this, NOT MongoDB _id
        const patientRecord = await patientService.getById(user.id)
        const customPatientId = patientRecord?.patientId ?? user.id
        setPatientName(patientRecord?.name ?? user.name ?? "")
        const analyses = await cervixAnalysisService.getByPatient(customPatientId)
        const data: ReportData[] = []
        for (const a of analyses) {
          let doctorName = "Screening Unit (AI Only)"
          if (a.doctorId) { const doc = await doctorService.getById(a.doctorId); doctorName = doc?.name ?? "Unknown Doctor" }
          const cd = a.createdAt ? new Date(a.createdAt.toDate ? a.createdAt.toDate() : a.createdAt) : new Date()
          const rd = a.doctorReviewAt ? new Date(a.doctorReviewAt.toDate ? a.doctorReviewAt.toDate() : a.doctorReviewAt) : cd
          const raw = (a.result ?? "").toLowerCase()
          const aiResult: RiskLevel = raw === "abnormal" ? "abnormal" : raw === "mild" ? "mild" : raw === "normal" ? "normal"
            : (a.riskLevel === "high" ? "abnormal" : a.riskLevel === "medium" ? "mild" : "normal")
          const confidence = a.confidence ?? 0
          const recs = Array.isArray(a.recommendations) && a.recommendations.length ? (a.recommendations as string[]) : DEFAULT_RECS[aiResult]
          data.push({
            id: a.id!, date: cd.toLocaleDateString(), type: "Cervical Cancer Screening", patientId: customPatientId,
            aiResult, confidence, recommendations: recs, doctor: doctorName, notes: a.doctorFeedback ?? a.analysis ?? "",
            imageUrl: a.imageUrl || undefined, doctorReviewed: !!a.doctorId, reviewDate: rd.toLocaleDateString(),
            treatmentPlan: a.nextSteps || undefined,
          })
        }
        setReports(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
      } catch (err) {
        console.error("[ViewReports]", err)
        toast({ title: "Failed to load reports", description: "Please refresh and try again." })
      } finally { setLoading(false) }
    }
    load()
  }, [user?.id])

  const filtered = reports.filter((r) =>
    r.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.patientId.toLowerCase().includes(searchTerm.toLowerCase()))

  if (loading) return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin" /><span className="ml-2">Loading reports...</span>
    </div>
  )

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-300">Your Screening Reports</h3>
              <p className="text-sm text-blue-700 dark:text-blue-400">AI-assisted cervical cancer screening results. Always consult your doctor for medical advice.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Medical Reports</CardTitle>
          <CardDescription>Your AI-assisted cervical screening results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <Search className="h-4 w-4 text-gray-400" />
            <Input placeholder="Search by type, doctor, or patient ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" />
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FlaskConical className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="font-medium">No screening reports found</p>
              <p className="text-sm mt-1">Your AI analysis results will appear here after a screening.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {filtered.map((report) => (
                <div key={report.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="flex flex-col items-center min-w-[52px]">
                        <Calendar className="h-5 w-5 text-gray-400 mb-1" />
                        <div className="text-xs font-medium text-center">{report.date}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-semibold">{report.type}</h3>
                          <ResultBadge level={report.aiResult} />
                          {report.doctorReviewed && <Badge variant="secondary" className="flex items-center gap-1"><UserCheck className="h-3 w-3" />Doctor Reviewed</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">Screened by: {report.doctor}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="h-1.5 w-24 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${report.aiResult === "normal" ? "bg-emerald-500" : report.aiResult === "mild" ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${report.confidence}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{report.confidence.toFixed(1)}% confidence</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setSelectedReport(report)}><Eye className="h-4 w-4 mr-1" />View</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Screening Report Details</DialogTitle>
                            <DialogDescription>{selectedReport?.type} - {selectedReport?.date}</DialogDescription>
                          </DialogHeader>
                          {selectedReport && (
                            <div className="space-y-5 pt-2">
                              <div className="rounded-xl p-5" style={{ background: RESULT_BG[selectedReport.aiResult], border: `2px solid ${RESULT_BORDER[selectedReport.aiResult]}` }}>
                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">AI Analysis Result</div>
                                <div className="flex items-center justify-between">
                                  <div className="text-2xl font-bold" style={{ color: RESULT_COLOR[selectedReport.aiResult] }}>{RESULT_LABEL[selectedReport.aiResult]}</div>
                                  <div className="text-right"><div className="text-xs text-gray-500">Confidence</div><div className="text-xl font-bold" style={{ color: RESULT_COLOR[selectedReport.aiResult] }}>{selectedReport.confidence.toFixed(1)}%</div></div>
                                </div>
                                <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div className="h-full rounded-full" style={{ width: `${selectedReport.confidence}%`, background: RESULT_COLOR[selectedReport.aiResult] }} />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div><span className="font-semibold text-gray-600">Date:</span><p>{selectedReport.date}</p></div>
                                <div><span className="font-semibold text-gray-600">Screened By:</span><p>{selectedReport.doctor}</p></div>
                                <div><span className="font-semibold text-gray-600">Patient ID:</span><p className="font-mono">{selectedReport.patientId}</p></div>
                                <div><span className="font-semibold text-gray-600">Doctor Reviewed:</span><p>{selectedReport.doctorReviewed ? `Yes - ${selectedReport.reviewDate}` : "Pending"}</p></div>
                              </div>
                              <div>
                                <h4 className="font-semibold text-sm mb-2">Clinical Recommendations</h4>
                                <ul className="space-y-1.5">{selectedReport.recommendations.map((r, i) => (<li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><span className="text-teal-500 mt-0.5 font-bold">{i+1}.</span>{r}</li>))}</ul>
                              </div>
                              {selectedReport.notes && <div><h4 className="font-semibold text-sm mb-2">{selectedReport.doctorReviewed ? "Doctor Assessment" : "Screening Notes"}</h4><p className="text-sm bg-gray-50 dark:bg-slate-800 p-3 rounded-lg">{selectedReport.notes}</p></div>}
                              {selectedReport.treatmentPlan && <div><h4 className="font-semibold text-sm mb-2">Treatment Plan</h4><p className="text-sm bg-gray-50 dark:bg-slate-800 p-3 rounded-lg">{selectedReport.treatmentPlan}</p></div>}
                              {selectedReport.imageUrl && <div><h4 className="font-semibold text-sm mb-2">Cervix Image</h4><img src={selectedReport.imageUrl} alt="Cervix scan" className="max-w-xs rounded-lg border" /></div>}
                              <div className="flex gap-2 pt-2 border-t">
                                <Button variant="outline" className="gap-2 border-teal-500 text-teal-600 hover:bg-teal-50" onClick={() => openPrintWindow(selectedReport, patientName)}>
                                  <Printer className="h-4 w-4" />Print Report
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="ghost" title="Print report" className="text-teal-600 hover:bg-teal-50" onClick={() => openPrintWindow(report, patientName)}>
                        <Printer className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Health Summary</CardTitle><CardDescription>Overview of your screening history</CardDescription></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center"><div className="text-2xl font-bold text-teal-600">{reports.length}</div><div className="text-sm text-muted-foreground">Total Screenings</div></div>
            <div className="text-center"><div className="text-2xl font-bold text-blue-600">{reports.filter((r) => r.doctorReviewed).length}</div><div className="text-sm text-muted-foreground">Doctor-Reviewed</div></div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${reports[0]?.aiResult === "abnormal" ? "text-red-600" : reports[0]?.aiResult === "mild" ? "text-amber-600" : "text-emerald-600"}`}>
                {reports[0] ? RESULT_LABEL[reports[0].aiResult] : "No Data"}
              </div>
              <div className="text-sm text-muted-foreground">Latest Result</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}